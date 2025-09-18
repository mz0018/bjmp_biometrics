import os
import json
from PIL import Image
import torch
import clip
import numpy as np
from app.helpers.face_utils import detect_and_crop_face  # 👈 used for cropping

# Load CLIP model once globally
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# In-memory cache { visitor_id: {embedding, meta} }
embedding_cache = {}


def get_embedding(image_file, cache_key=None):
    """
    Generate (or retrieve cached) normalized embedding using CLIP,
    with face detection & cropping.
    """
    if cache_key and cache_key in embedding_cache:
        return embedding_cache[cache_key]["embedding"]

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

    # Normalize
    embedding = embedding / np.linalg.norm(embedding)

    # Cache if needed
    if cache_key:
        embedding_cache.setdefault(cache_key, {})["embedding"] = embedding.tolist()

    return embedding.tolist()


def cosine_similarity(embedding1, embedding2):
    emb1, emb2 = np.array(embedding1), np.array(embedding2)
    return float(np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2)))


def find_best_match(query_embedding, threshold=0.94):
    """
    Search the embedding cache for the best match.
    """
    best_id, best_score = None, -1

    for visitor_id, data in embedding_cache.items():
        sim = cosine_similarity(query_embedding, data["embedding"])
        if sim > best_score:
            best_score, best_id = sim, visitor_id

    if best_id and best_score >= threshold:
        return {
            "visitor_id": best_id,
            "similarity": best_score,
            "meta": embedding_cache[best_id]["meta"],
        }
    return False

def preload_embeddings(folder="./saved_faces"):
    """
    Load all visitor embeddings into memory at startup.
    Expects each face to have .webp image and .json metadata.
    """
    count = 0
    for filename in os.listdir(folder):
        if not filename.endswith(".webp"):
            continue

        json_path = os.path.join(folder, f"{filename}.json")
        if not os.path.exists(json_path):
            continue

        with open(json_path, "r") as f:
            visitor_info = json.load(f)

        file_path = os.path.join(folder, filename)
        embedding = get_embedding(file_path, cache_key=visitor_info["visitor_id"])

        embedding_cache[visitor_info["visitor_id"]] = {
            "embedding": embedding,
            "meta": visitor_info,
        }
        count += 1

    print(f"✅ Preloaded {count} embeddings into memory")
