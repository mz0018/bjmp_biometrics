from fastapi import APIRouter
from fastapi.concurrency import run_in_threadpool
from app.models.face_model import FaceData
from app.helpers.image_utils import base64_to_webp
from app.helpers.embedding_utils import get_embedding
from PIL import Image

router = APIRouter()

@router.post("/register-face")
async def register_face(data: FaceData):
    errors = {}

    if not data.id.strip():
        errors["id"] = "Admin ID is required"
    if not data.first_name.strip():
        errors["first_name"] = "First name is required"
    if not data.last_name.strip():
        errors["last_name"] = "Last name is required"
    if not data.visitor_name.strip():
        errors["visitor_name"] = "Visitor name is required"
    if not data.inmate_name.strip():
        errors["inmate_name"] = "Inmate name is required"
    if not data.visitor_address.strip():
        errors["visitor_address"] = "Visitor address is required"
    if not data.images or len(data.images) == 0:
        errors["images"] = "At least one image is required"

    if errors:
        return {"status": "error", "errors": errors}

    converted_images_info = []
    embeddings = []

    for idx, img_base64 in enumerate(data.images):
        webp_file = base64_to_webp(img_base64)
        img = Image.open(webp_file)
        webp_file.seek(0)

        # Run embedding safely in a threadpool
        embedding = await run_in_threadpool(get_embedding, webp_file)
        embeddings.append(embedding)

        converted_images_info.append({
            "image_index": idx,
            "format": img.format,
            "size_bytes": len(webp_file.getvalue()),
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
