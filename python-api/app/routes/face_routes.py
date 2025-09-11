from fastapi import APIRouter
from fastapi.concurrency import run_in_threadpool
from app.models.face_model import FaceData
from app.helpers.image_utils import base64_to_webp, generate_filename
from app.helpers.embedding_utils import get_embedding
import os

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
        ("visitor_address", "Visitor address")
    ]

    for field, name in required_fields:
        if not getattr(data, field).strip():
            errors[field] = f"{name} is required"

    if not data.images or len(data.images) == 0:
        errors["images"] = "At least one image is required"

    if errors:
        return {"status": "error", "errors": errors}

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

    return {
        "status": "success",
        "admin": {
            "id": data.id,
            "first_name": data.first_name,
            "last_name": data.last_name,
        },
        "visitor": {
            "name": data.visitor_name,
            "inmate": data.inmate_name,
            "address": data.visitor_address,
        },
        "converted_images": converted_images_info,
        "embeddings": embeddings,
    }
