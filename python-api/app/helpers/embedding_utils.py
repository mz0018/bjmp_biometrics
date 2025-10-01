# app/helpers/embedding_utils.py
import os
import json
from PIL import Image
import torch
import clip
import numpy as np
from app.helpers.face_utils import detect_and_crop_face

# Load CLIP model once globally
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# In-memory cache { visitor_id: { meta: {...}, embeddings: [ [...], [...] ] } }
embedding_cache = {}


def get_embedding(image_file):
    """
    Generate normalized embedding using CLIP.
    Accepts either a file path (str) or a file-like object (has read()).
    Returns a python list (normalized vector).
    """
    # Read bytes (works for both path & file-like)
    image_bytes = (
        open(image_file, "rb").read() if isinstance(image_file, str) else image_file.read()
    )

    # Detect & crop face → returns PIL.Image
    img = detect_and_crop_face(image_bytes)

    # Preprocess + inference
    with torch.no_grad():
        img_input = preprocess(img).unsqueeze(0).to(device)
        embedding = model.encode_image(img_input).cpu().numpy().flatten()

    # Normalize (avoid division by zero)
    norm = np.linalg.norm(embedding)
    if norm == 0:
        raise ValueError("Zero vector embedding")
    embedding = (embedding / norm).tolist()

    return embedding


def cosine_similarity(embedding1, embedding2):
    emb1, emb2 = np.array(embedding1), np.array(embedding2)
    denom = (np.linalg.norm(emb1) * np.linalg.norm(emb2))
    if denom == 0:
        return -1.0
    return float(np.dot(emb1, emb2) / denom)


def find_best_match(query_embedding, threshold=0.90):
    """
    Search the embedding_cache for the best match across all visitors and their embeddings.
    Returns a dict with visitor_id, similarity, meta or False if none passes threshold.
    """
    best_id, best_score = None, -1.0

    for visitor_id, data in embedding_cache.items():
        for emb in data.get("embeddings", []):
            sim = cosine_similarity(query_embedding, emb)
            if sim > best_score:
                best_score = sim
                best_id = visitor_id

    if best_id and best_score >= threshold:
        return {
            "visitor_id": best_id,
            "similarity": best_score,
            "meta": embedding_cache[best_id]["meta"],
        }
    return False


def preload_embeddings(folder="./saved_faces"):
    """
    Load all visitor embeddings + metadata into memory at startup.
    Expects one JSON per visitor with structure:
    {
      "visitor_id": "...",
      "name": "...",
      ...
      "images": [
         {"filename": "...", "embedding": [...]},
         ...
      ]
    }
    """
    count = 0
    if not os.path.exists(folder):
        print("saved_faces folder does not exist, skipping preload")
        return

    for filename in os.listdir(folder):
        if not filename.endswith(".json"):
            continue

        json_path = os.path.join(folder, filename)
        try:
            with open(json_path, "r") as f:
                visitor_info = json.load(f)
        except Exception as e:
            print(f"Failed to read {json_path}: {e}")
            continue

        visitor_id = visitor_info.get("visitor_id")
        if not visitor_id:
            continue

        # Ensure cache entry exists
        embedding_cache.setdefault(visitor_id, {
            "meta": {
                "visitor_id": visitor_id,
                "name": visitor_info.get("name"),
                "address": visitor_info.get("address"),
                "contact": visitor_info.get("contact"),
                "gender": visitor_info.get("gender"),
                "inmates": visitor_info.get("inmates", []),
            },
            "embeddings": []
        })

        # Add each image embedding
        for img in visitor_info.get("images", []):
            emb = img.get("embedding")
            if emb:
                embedding_cache[visitor_id]["embeddings"].append(emb)
                count += 1

    print(f"✅ Preloaded {count} embeddings across {len(embedding_cache)} visitors")
