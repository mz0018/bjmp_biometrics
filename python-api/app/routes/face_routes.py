from fastapi import APIRouter
from fastapi.concurrency import run_in_threadpool
from app.models.face_model import FaceData
from app.helpers.image_utils import base64_to_webp, generate_filename
from app.helpers.embedding_utils import get_embedding
import os, json, uuid, numpy as np

router = APIRouter()

SAVE_FOLDER = "./saved_faces"
os.makedirs(SAVE_FOLDER, exist_ok=True)

# {filename: (embedding_array, visitor_info)}
embeddings_cache = {}


async def load_embeddings():
    """Load all saved embeddings into memory on startup."""
    for filename in os.listdir(SAVE_FOLDER):
        if not filename.endswith(".webp"):
            continue

        file_path = os.path.join(SAVE_FOLDER, filename)
        json_path = os.path.join(SAVE_FOLDER, f"{filename}.json")

        with open(file_path, "rb") as f:
            embedding = await run_in_threadpool(get_embedding, f)

        visitor_info = None
        if os.path.exists(json_path):
            with open(json_path, "r") as f:
                visitor_info = json.load(f)

        embeddings_cache[filename] = (np.array(embedding), visitor_info)


@router.on_event("startup")
async def startup_event():
    await load_embeddings()


@router.post("/register-face")
async def register_face(data: FaceData):
    # --- Validation ---
    required_fields = {
        "id": "Admin ID",
        "first_name": "First name",
        "last_name": "Last name",
        "visitor_name": "Visitor name",
        "inmate_name": "Inmate name",
        "visitor_address": "Visitor address",
    }
    errors = {f: f"{name} is required" for f, name in required_fields.items() if not getattr(data, f).strip()}
    if not data.images:
        errors["images"] = "At least one image is required"

    if errors:
        return {"status": "error", "errors": errors}

    # Unique visitor ID
    visitor_id = str(uuid.uuid4())
    converted_images_info, embeddings = [], []

    visitor_data = {
        "visitor_id": visitor_id,
        "name": data.visitor_name,
        "inmate": data.inmate_name,
        "address": data.visitor_address,
    }

    for idx, img_base64 in enumerate(data.images):
        # Convert base64 → WebP
        webp_file = base64_to_webp(img_base64)

        # Save image
        filename = generate_filename(data.id)
        file_path = os.path.join(SAVE_FOLDER, filename)
        with open(file_path, "wb") as f:
            f.write(webp_file.getvalue())

        # Embedding
        webp_file.seek(0)
        embedding = await run_in_threadpool(get_embedding, webp_file)
        embeddings.append(embedding)

        # Save visitor info JSON (overwrite ensures consistency)
        json_path = os.path.join(SAVE_FOLDER, f"{filename}.json")
        with open(json_path, "w") as f:
            json.dump(visitor_data, f)

        # Update memory cache
        embeddings_cache[filename] = (np.array(embedding), visitor_data)

        converted_images_info.append({
            "image_index": idx,
            "size_bytes": len(webp_file.getvalue()),
            "saved_filename": filename,
        })

    return {
        "status": "success",
        "admin": {
            "id": data.id,
            "first_name": data.first_name,
            "last_name": data.last_name,
        },
        "visitor": visitor_data,
        "converted_images": converted_images_info,
        "embeddings": embeddings,
    }


@router.post("/recognize-face")
async def recognize_face(data: dict):
    image_base64 = data.get("image")
    if not image_base64:
        return {"matched": False, "message": "No image provided"}

    # Convert base64 → embedding
    webp_file = base64_to_webp(image_base64)
    webp_file.seek(0)
    embedding = np.array(await run_in_threadpool(get_embedding, webp_file))

    if not embeddings_cache:
        return {"matched": False, "message": "No registered faces found"}

    # Vectorized cosine similarity
    sims = [
        (float(np.dot(embedding, e) / (np.linalg.norm(embedding) * np.linalg.norm(e))), v_info)
        for e, v_info in embeddings_cache.values()
    ]

    best_sim, best_visitor = max(sims, key=lambda x: x[0])
    THRESHOLD = 0.8

    if best_sim < THRESHOLD:
        return {"matched": False, "message": "No face matched", "similarity": best_sim}

    return {"matched": True, "visitor": best_visitor, "similarity": best_sim}
