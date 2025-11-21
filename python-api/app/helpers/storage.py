# app/helpers/storage.py
import os
import json

SAVE_FOLDER = "./saved_faces"
os.makedirs(SAVE_FOLDER, exist_ok=True)

# In-memory cache for batch updates to reduce file I/O
_batch_cache = {}

def save_visitor_data(visitor_data: dict, filename: str, embedding: list, flush: bool = True):
    """
    Save or update visitor's JSON file efficiently.
    
    - visitor_data: dict with visitor metadata
    - filename: saved image filename
    - embedding: embedding vector list
    - flush: if True, write immediately; if False, keep in memory for batch writes
    """
    visitor_id = visitor_data['visitor_id']
    json_path = os.path.join(SAVE_FOLDER, f"{visitor_id}.json")

    # Use batch cache to accumulate multiple images per visitor
    if visitor_id not in _batch_cache:
        if os.path.exists(json_path):
            try:
                with open(json_path, "r") as f:
                    data = json.load(f)
            except Exception:
                data = {**visitor_data, "images": []}
        else:
            data = {**visitor_data, "images": []}
        _batch_cache[visitor_id] = data
    else:
        data = _batch_cache[visitor_id]

    # Append the new image
    data.setdefault("images", []).append({"filename": filename, "embedding": embedding})

    # Write immediately if flush=True
    if flush:
        with open(json_path, "w") as f:
            json.dump(data, f, indent=2)
        _batch_cache.pop(visitor_id, None)  # remove from cache after writing

    return data

def flush_batch_cache():
    """Write all remaining batch cache entries to disk."""
    for visitor_id, data in _batch_cache.items():
        json_path = os.path.join(SAVE_FOLDER, f"{visitor_id}.json")
        with open(json_path, "w") as f:
            json.dump(data, f, indent=2)
    _batch_cache.clear()
