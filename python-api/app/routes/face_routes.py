from fastapi import APIRouter
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import JSONResponse
from app.models.face_model import FaceData
from app.helpers.image_utils import base64_to_webp, generate_filename
from app.helpers.embedding_utils import get_embedding, embedding_cache, find_best_match
from app.helpers.json_response import json_response
import os, uuid, asyncio, json
import motor.motor_asyncio
from datetime import datetime, timedelta
from app.ws_manager import clients

router = APIRouter()

# MongoDB
MONGO_URI = "mongodb+srv://bjmp_face_recog:LXKGvyAsIaAx32hT@bjmp.kexnzgt.mongodb.net/?retryWrites=true&w=majority&appName=bjmp"
db_client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
logs_collection = db_client["bjmp_biometrics"]["visitorsLogs"]

SAVE_FOLDER = "./saved_faces"
os.makedirs(SAVE_FOLDER, exist_ok=True)

cache_lock = asyncio.Lock()  # async-safe in-memory cache lock

# --- Helpers ---
async def send_to_clients(message: str):
    dead_clients = [ws for ws in clients if not await _safe_send(ws, message)]
    for ws in dead_clients:
        clients.remove(ws)

async def _safe_send(ws, message: str):
    try:
        await ws.send_text(message)
        return True
    except:
        return False

def build_visitor_info(meta: dict):
    return {k: meta.get(k, "") for k in ["name", "address", "contact", "gender"]}

def save_visitor_data(visitor_data):
    """Save visitor JSON once per visitor."""
    json_path = os.path.join(SAVE_FOLDER, f"{visitor_data['visitor_id']}.json")
    import json
    with open(json_path, "w") as f:
        json.dump(visitor_data, f, indent=2)

# --- Routes ---
@router.post("/register-face")
async def register_face(data: FaceData):
    logs = ["Register face request received"]
    required_fields = ["id", "first_name", "last_name", "visitor_name", 
                       "visitor_address", "visitor_contact", "visitor_gender"]
    errors = {f: f"{f.replace('_', ' ').title()} is required" 
              for f in required_fields if not str(getattr(data, f, "")).strip()}
    if not data.images:
        errors["images"] = "At least one image is required"
    if errors:
        logs.append("Validation failed")
        return json_response({"status": "error", "errors": errors, "logs": logs})

    logs.append("Validation passed")
    visitor_id = str(uuid.uuid4())
    visitor_data = {
        "visitor_id": visitor_id,
        "name": data.visitor_name,
        "address": data.visitor_address,
        "contact": data.visitor_contact,
        "gender": data.visitor_gender,
        "inmates": [i.dict() for i in data.inmates],
        "images": []
    }
    converted_images_info, embeddings = [], []

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

        # Async-safe cache update
        async with cache_lock:
            embedding_cache.setdefault(visitor_id, {"meta": visitor_data, "embeddings": []})
            embedding_cache[visitor_id]["embeddings"].append(embedding)

        # Save image info for batch JSON
        visitor_data["images"].append({"filename": filename, "embedding": embedding})
        converted_images_info.append({
            "image_index": idx,
            "size_bytes": len(webp_file.getvalue()),
            "saved_filename": filename,
        })

    save_visitor_data(visitor_data)

    logs.append("All images processed")
    logs.append("Visitor registration completed")

    return json_response({
        "status": "success",
        "logs": logs,
        "admin": {"id": data.id, "first_name": data.first_name, "last_name": data.last_name},
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

        # --- Visitor confirms identity ---
        if visitor_id and selected_inmate:
            async with cache_lock:
                cached = embedding_cache.get(visitor_id, {}).get("meta", {})
            visitor_info = build_visitor_info(cached)

            one_hour_ago = datetime.utcnow() - timedelta(hours=1)
            existing_log = await logs_collection.find_one({
                "visitor_id": visitor_id,
                "timestamp": {"$gte": one_hour_ago},
            })
            if existing_log:
                return json_response({"status": "duplicate", "message": "Duplicated punch.", "log": existing_log})

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
            await send_to_clients("refresh_logs")
            return json_response({"status": "success", "log": log_entry})

        # --- Recognition from image ---
        if image_base64:
            webp_file = base64_to_webp(image_base64)
            webp_file.seek(0)
            query_embedding = await run_in_threadpool(get_embedding, webp_file)

            async with cache_lock:
                match = find_best_match(query_embedding, threshold=0.93) if embedding_cache else None

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
            await send_to_clients("refresh_logs")
            return json_response({"status": "success", "log": response_log})

        return json_response({"status": "error", "message": "No image or visitor confirmation provided"})
    except Exception as e:
        return json_response({"status": "error", "message": str(e)})

@router.get("/visitor-json/{visitor_id}")
async def get_visitor_json(visitor_id: str):
    json_path = os.path.join(SAVE_FOLDER, f"{visitor_id}.json")
    if not os.path.exists(json_path):
        print(f"[DEBUG] Visitor JSON not found for ID: {visitor_id}")
        return JSONResponse(status_code=404, content={"error": "Visitor JSON not found"})
    
    with open(json_path, "r") as f:
        visitor_data = json.load(f)
    
    print(f"[DEBUG] Visitor JSON for ID {visitor_id}: {visitor_data}")
    return JSONResponse(content=visitor_data)
