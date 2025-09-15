import os
import json
from PIL import Image
import torch
import clip
import numpy as np

# Load CLIP model once globally
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# In-memory cache { visitor_id: embedding }
embedding_cache = {}


def get_embedding(image_file, cache_key=None):
    """
    Generate (or retrieve cached) normalized embedding using CLIP.
    """
    if cache_key and cache_key in embedding_cache:
        return embedding_cache[cache_key]

    img = Image.open(image_file).convert("RGB")
    img_input = preprocess(img).unsqueeze(0).to(device)

    with torch.no_grad():
        embedding = model.encode_image(img_input)
        embedding = embedding.detach().cpu().numpy().flatten()

    embedding = embedding / np.linalg.norm(embedding)  # normalize
    embedding_list = embedding.tolist()

    if cache_key:
        embedding_cache[cache_key] = embedding_list

    return embedding_list


def cosine_similarity(embedding1, embedding2):
    emb1 = np.array(embedding1)
    emb2 = np.array(embedding2)
    return float(np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2)))


def find_best_match(query_embedding, threshold=0.75):
    """
    Search the embedding cache for the best match.
    """
    best_score = -1
    best_id = None
    for visitor_id, data in embedding_cache.items():
        sim = cosine_similarity(query_embedding, data["embedding"])
        if sim > best_score:
            best_score = sim
            best_id = visitor_id

    if best_id and best_score >= threshold:
        return {
            "visitor_id": best_id,
            "similarity": best_score,
            "meta": embedding_cache[best_id]["meta"]
        }
    return None


def preload_embeddings(folder="./saved_faces"):
    """
    Load all visitor embeddings into memory at startup.
    Expects each face to have .webp image and .json metadata.
    """
    count = 0
    for filename in os.listdir(folder):
        if filename.endswith(".webp"):
            json_path = os.path.join(folder, f"{filename}.json")
            if not os.path.exists(json_path):
                continue

            with open(json_path, "r") as f:
                visitor_info = json.load(f)

            file_path = os.path.join(folder, filename)
            embedding = get_embedding(file_path, cache_key=visitor_info["visitor_id"])

            # Store in cache with meta
            embedding_cache[visitor_info["visitor_id"]] = {
                "embedding": embedding,
                "meta": visitor_info
            }
            count += 1

    print(f"✅ Preloaded {count} embeddings into memory")
