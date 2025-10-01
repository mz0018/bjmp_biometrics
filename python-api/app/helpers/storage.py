# app/helpers/storage.py
import os
import json

SAVE_FOLDER = "./saved_faces"
os.makedirs(SAVE_FOLDER, exist_ok=True)

def save_visitor_data(visitor_data, filename, embedding):
    """
    Save or update visitor's JSON file with full metadata.
    visitor_data: dict including at least 'visitor_id' and other metadata (name, address, ...).
    filename: stored image filename (string)
    embedding: list of floats (the embedding vector)
    """
    json_path = os.path.join(SAVE_FOLDER, f"{visitor_data['visitor_id']}.json")

    if os.path.exists(json_path):
        try:
            with open(json_path, "r") as f:
                data = json.load(f)
        except Exception:
            data = {**visitor_data, "images": []}
    else:
        data = {**visitor_data, "images": []}

    data.setdefault("images", []).append({
        "filename": filename,
        "embedding": embedding
    })

    with open(json_path, "w") as f:
        json.dump(data, f, indent=2)

    return data
