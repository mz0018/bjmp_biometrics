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
    logs = []
    logs.append("Register face request received")

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
        logs.append("Validation failed")
        return json_response({"status": "error", "errors": errors, "logs": logs})

    logs.append("Validation passed")

    visitor_id = str(uuid.uuid4())
    converted_images_info, embeddings = [], []

    logs.append(f"Generated visitor_id: {visitor_id}")

    visitor_data = {
        "visitor_id": visitor_id,
        "name": data.visitor_name,
        "address": data.visitor_address,
        "contact": data.visitor_contact,
        "gender": data.visitor_gender,
        "inmates": [i.dict() for i in data.inmates],
    }

    for idx, img_base64 in enumerate(data.images):
        logs.append(f"Processing image {idx+1}/{len(data.images)}")

        webp_file = base64_to_webp(img_base64)

        filename = generate_filename(data.id)
        file_path = os.path.join(SAVE_FOLDER, filename)
        with open(file_path, "wb") as f:
            f.write(webp_file.getvalue())

        logs.append(f"Image saved: {filename}")

        webp_file.seek(0)
        embedding = await run_in_threadpool(get_embedding, webp_file)
        embeddings.append(embedding)

        logs.append(f"Embedding generated for image {idx+1}")

        embedding_cache.setdefault(visitor_id, {"meta": visitor_data, "embeddings": []})
        embedding_cache[visitor_id]["embeddings"].append(embedding)

        save_visitor_data(visitor_data, filename, embedding)

        converted_images_info.append({
            "image_index": idx,
            "size_bytes": len(webp_file.getvalue()),
            "saved_filename": filename,
        })

    logs.append("All images processed")
    logs.append("Visitor registration completed")

    return json_response({
        "status": "success",
        "logs": logs,
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
    try:
        image_base64 = data.get("image")
        visitor_id = data.get("visitor_id")
        selected_inmate = data.get("selected_inmate")
        similarity = data.get("similarity")

        if visitor_id and selected_inmate:
            cached = embedding_cache.get(visitor_id, {}).get("meta", {})

            visitor_info = {
                "name": cached.get("name", ""),
                "address": cached.get("address", ""),
                "contact": cached.get("contact", ""),
                "gender": cached.get("gender", ""),
            }

            one_hour_ago = datetime.utcnow() - timedelta(hours=1)

            existing_log = await logs_collection.find_one({
                "visitor_id": visitor_id,
                "timestamp": {"$gte": one_hour_ago},
            })

            if existing_log:
                return json_response({
                    "status": "duplicate",
                    "message": "Duplicated punch.",
                    "log": existing_log
                })

            log_entry = {
                "visitor_id": visitor_id,
                "visitor_info": visitor_info,     
                "selected_inmate": selected_inmate,
                "similarity": similarity,
                "timestamp": datetime.utcnow(),
                "expiresAt": datetime.utcnow() + timedelta(hours=1),
                "isSaveToLogs": False,             
            }
            await logs_collection.insert_one(log_entry)

            for client in clients:
                try:
                    await client.send_text("refresh_logs")
                except:
                    pass

            return json_response({"status": "success", "log": log_entry})

        if image_base64:
            webp_file = base64_to_webp(image_base64)
            webp_file.seek(0)
            query_embedding = await run_in_threadpool(get_embedding, webp_file)

            match = None
            if embedding_cache:
                match = find_best_match(query_embedding, threshold=0.90)

            if not match:
                return json_response({"status": "not_found", "message": "No match found"})

            response_log = {
                "visitor_id": match["visitor_id"],
                "visitor_info": match.get("meta"),
                "similarity": match.get("similarity"),
                "timestamp": datetime.utcnow(),
                "expiresAt": datetime.utcnow() + timedelta(hours=1),
                "isSaveToLogs": False,
            }

            for client in clients:
                try:
                    await client.send_text("refresh_logs")
                except:
                    pass

            return json_response({"status": "success", "log": response_log})

        return json_response({"status": "error", "message": "No image or visitor confirmation provided"})

    except Exception as e:
        return json_response({"status": "error", "message": str(e)})
