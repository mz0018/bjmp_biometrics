from fastapi import APIRouter
from app.models.face_model import FaceData

router = APIRouter()

@router.post("/register-face")
async def register_face(data: FaceData):
    return {
        "status": "success",
        "admin": {
            "id": data.id,
            "first_name": data.first_name,
            "last_name": data.last_name,
        },
        "received_images": len(data.images),
    }
