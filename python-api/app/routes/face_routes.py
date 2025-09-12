from fastapi import APIRouter
from fastapi.concurrency import run_in_threadpool
from app.models.face_model import FaceData
from app.helpers.image_utils import base64_to_webp, generate_filename
from app.helpers.embedding_utils import get_embedding
import os
import numpy as np
import json
import uuid

router = APIRouter()

# Folder to save images
SAVE_FOLDER = "./saved_faces"
os.makedirs(SAVE_FOLDER, exist_ok=True)

@router.post("/register-face")
async def register_face(data: FaceData):
    errors = {}

    # --- Validation ---
    required_fields = [
        ("id", "Admin ID"),
        ("first_name", "First name"),
        ("last_name", "Last name"),
        ("visitor_name", "Visitor name"),
        ("inmate_name", "Inmate name"),
        ("visitor_address", "Visitor address"),
    ]

    for field, name in required_fields:
        if not getattr(data, field).strip():
            errors[field] = f"{name} is required"

    if not data.images or len(data.images) == 0:
        errors["images"] = "At least one image is required"

    if errors:
        return {"status": "error", "errors": errors}

    # Generate unique visitor ID
    visitor_id = str(uuid.uuid4())

    converted_images_info = []
    embeddings = []

    # --- Convert images, save, and generate embeddings ---
    for idx, img_base64 in enumerate(data.images):
        # Convert base64 to WebP bytes
        webp_file = base64_to_webp(img_base64)

        # Generate unique filename and save
        filename = generate_filename(data.id)
        file_path = os.path.join(SAVE_FOLDER, filename)
        with open(file_path, "wb") as f:
            f.write(webp_file.getvalue())

        # Generate embedding asynchronously
        webp_file.seek(0)  # Ensure pointer is at start
        embedding = await run_in_threadpool(get_embedding, webp_file)
        embeddings.append(embedding)

        converted_images_info.append({
            "image_index": idx,
            "size_bytes": len(webp_file.getvalue()),
            "saved_filename": filename,
        })

        # --- Save visitor info as JSON ---
        visitor_data = {
            "visitor_id": visitor_id,
            "name": data.visitor_name,
            "inmate": data.inmate_name,
            "address": data.visitor_address,
        }
        json_path = os.path.join(SAVE_FOLDER, f"{filename}.json")
        with open(json_path, "w") as f:
            json.dump(visitor_data, f)

    return {
        "status": "success",
        "admin": {
            "id": data.id,
            "first_name": data.first_name,
            "last_name": data.last_name,
        },
        "visitor": {
            "visitor_id": visitor_id,
            "name": data.visitor_name,
            "inmate": data.inmate_name,
            "address": data.visitor_address,
        },
        "converted_images": converted_images_info,
        "embeddings": embeddings,
    }


@router.post("/recognize-face")
async def recognize_face(data: dict):
    image_base64 = data.get("image")
    if not image_base64:
        return {"matched": False, "message": "No image provided"}

    webp_file = base64_to_webp(image_base64)
    webp_file.seek(0)

    embedding = await run_in_threadpool(get_embedding, webp_file)

    matches = []
    for filename in os.listdir(SAVE_FOLDER):
        if filename.endswith(".webp"):
            file_path = os.path.join(SAVE_FOLDER, filename)
            with open(file_path, "rb") as f:
                saved_embedding = await run_in_threadpool(get_embedding, f)
            sim = np.dot(embedding, saved_embedding) / (np.linalg.norm(embedding) * np.linalg.norm(saved_embedding))
            matches.append((sim, filename))

    if not matches:
        return {"matched": False, "message": "No saved embeddings"}

    best_sim, best_file = max(matches, key=lambda x: x[0])
    THRESHOLD = 0.8

    if best_sim >= THRESHOLD:
        # Load visitor info from JSON
        json_path = os.path.join(SAVE_FOLDER, f"{best_file}.json")
        if os.path.exists(json_path):
            with open(json_path, "r") as f:
                visitor_info = json.load(f)
        else:
            visitor_info = None

        return {
            "matched": True,
            "visitor": visitor_info,
            "similarity": best_sim
        }
    else:
        return {"matched": False, "similarity": best_sim}

    """
    Recognize a face by comparing its embedding with saved embeddings.
    Expects JSON: { "image": "<base64 string>" }
    """
    image_base64 = data.get("image")
    if not image_base64:
        return {"matched": False, "message": "No image provided"}

    # Convert base64 to WebP bytes
    webp_file = base64_to_webp(image_base64)
    webp_file.seek(0)

    # Generate embedding
    embedding = await run_in_threadpool(get_embedding, webp_file)

    # Load saved embeddings (for simplicity, load all from disk)
    # In a real app, you might store embeddings in a database
    matches = []
    for filename in os.listdir(SAVE_FOLDER):
        if filename.endswith(".webp"):
            file_path = os.path.join(SAVE_FOLDER, filename)
            with open(file_path, "rb") as f:
                saved_embedding = await run_in_threadpool(get_embedding, f)
            # Cosine similarity
            sim = np.dot(embedding, saved_embedding) / (np.linalg.norm(embedding) * np.linalg.norm(saved_embedding))
            matches.append((sim, filename))

    if not matches:
        return {"matched": False, "message": "No saved embeddings"}

    # Find best match
    best_sim, best_file = max(matches, key=lambda x: x[0])
    THRESHOLD = 0.8  # similarity threshold
    if best_sim >= THRESHOLD:
        # Extract admin_id from filename (assuming your format is "adminid_uuid.webp")
        admin_id = best_file.split("_")[0]
        return {"matched": True, "admin_id": admin_id, "similarity": best_sim}
    else:
        return {"matched": False, "similarity": best_sim}