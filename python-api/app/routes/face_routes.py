# app/routes/face_routes.py
from fastapi import APIRouter
from fastapi.concurrency import run_in_threadpool
from app.models.face_model import FaceData
from app.helpers.image_utils import base64_to_webp, generate_filename
from app.helpers.embedding_utils import get_embedding, embedding_cache, find_best_match
from app.helpers.storage import save_visitor_data
from app.helpers.json_response import json_response
import os, json, uuid, numpy as np
import motor.motor_asyncio
from datetime import datetime, timedelta
from app.ws_manager import clients
from bson import ObjectId

router = APIRouter()

MONGO_URI = "mongodb+srv://bjmp_face_recog:LXKGvyAsIaAx32hT@bjmp.kexnzgt.mongodb.net/?retryWrites=true&w=majority&appName=bjmp"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client["bjmp_biometrics"]
logs_collection = db["visitorsLogs"]

SAVE_FOLDER = "./saved_faces"
os.makedirs(SAVE_FOLDER, exist_ok=True)


@router.post("/register-face")
async def register_face(data: FaceData):
    # --- Validation ---
    required_fields = {
        "id": "Admin ID",
        "first_name": "First name",
        "last_name": "Last name",
        "visitor_name": "Visitor name",
        "visitor_address": "Visitor address",
        "visitor_contact": "Visitor contact",
        "visitor_gender": "Visitor gender"
    }
    errors = {f: f"{name} is required" for f, name in required_fields.items() if not getattr(data, f).strip()}
    if not data.images:
        errors["images"] = "At least one image is required"

    if errors:
        return json_response({"status": "error", "errors": errors})

    # Unique visitor ID
    visitor_id = str(uuid.uuid4())
    converted_images_info, embeddings = [], []

    # Core visitor metadata
    visitor_data = {
        "visitor_id": visitor_id,
        "name": data.visitor_name,
        "address": data.visitor_address,
        "contact": data.visitor_contact,
        "gender": data.visitor_gender,
        "inmates": [i.dict() for i in data.inmates],
    }

    for idx, img_base64 in enumerate(data.images):
        # Convert base64 → WebP
        webp_file = base64_to_webp(img_base64)

        # Save image
        filename = generate_filename(data.id)
        file_path = os.path.join(SAVE_FOLDER, filename)
        with open(file_path, "wb") as f:
            f.write(webp_file.getvalue())

        # Embedding (compute in threadpool)
        webp_file.seek(0)
        embedding = await run_in_threadpool(get_embedding, webp_file)
        embeddings.append(embedding)

        # Update in-memory cache (per-visitor, multiple embeddings)
        embedding_cache.setdefault(visitor_id, {"meta": visitor_data, "embeddings": []})
        embedding_cache[visitor_id]["embeddings"].append(embedding)

        # Save to visitor JSON on disk (full metadata)
        save_visitor_data(visitor_data, filename, embedding)

        # Info for API response
        converted_images_info.append({
            "image_index": idx,
            "size_bytes": len(webp_file.getvalue()),
            "saved_filename": filename,
        })

    return json_response({
        "status": "success",
        "admin": {
            "id": data.id,
            "first_name": data.first_name,
            "last_name": data.last_name,
        },
        "visitor": visitor_data,
        "converted_images": converted_images_info,
        "embeddings": embeddings,
    })


@router.post("/recognize-face")
async def recognize_face(data: dict):
    """
    Handles two simple flows:
    1) Recognition: frontend sends {"image": "<base64>"}.
       - returns match info (does NOT save image or log).
       - if no embeddings or no match, returns status "not_found".
    2) Confirmation/save: frontend sends {"visitor_id": "...", "selected_inmate": {...}, "similarity": ...}
       - saves a visit log (no image stored) and returns success.
    """
    try:
        image_base64 = data.get("image")
        visitor_id = data.get("visitor_id")
        selected_inmate = data.get("selected_inmate")
        similarity = data.get("similarity")

        # ------ Confirmation / Save flow (no image needed) ------
        if visitor_id and selected_inmate:
            log_entry = {
                "visitor_id": visitor_id,
                "selected_inmate": selected_inmate,
                "similarity": similarity,
                "timestamp": datetime.utcnow(),
                "expiresAt": datetime.utcnow() + timedelta(hours=1),
                "isSaveToLogs": True,
            }
            await logs_collection.insert_one(log_entry)

            # notify websocket clients
            for client in clients:
                try:
                    await client.send_text("refresh_logs")
                except:
                    pass

            return json_response({"status": "success", "log": log_entry})

        # ------ Recognition flow (image provided) ------
        if image_base64:
            # convert and embed (no file saving)
            webp_file = base64_to_webp(image_base64)
            webp_file.seek(0)
            query_embedding = await run_in_threadpool(get_embedding, webp_file)

            # If embedding cache is empty, we won't crash — just treat as no match
            match = None
            if embedding_cache:
                match = find_best_match(query_embedding, threshold=0.90)

            if not match:
                # Return not found (frontend can show "Visitor Not Found")
                return json_response({"status": "not_found", "message": "No match found"})

            # Prepare response object (do NOT save the image or log here)
            response_log = {
                "visitor_id": match["visitor_id"],
                "visitor_info": match.get("meta"),
                "similarity": match.get("similarity"),
                "timestamp": datetime.utcnow(),
                "expiresAt": datetime.utcnow() + timedelta(hours=1),
                "isSaveToLogs": False,
            }

            # notify websocket clients if you still want realtime updates (optional)
            for client in clients:
                try:
                    await client.send_text("refresh_logs")
                except:
                    pass

            return json_response({"status": "success", "log": response_log})

        # If neither image nor confirmation payload, return a simple error
        return json_response({"status": "error", "message": "No image or visitor confirmation provided"})

    except Exception as e:
        return json_response({"status": "error", "message": str(e)})
