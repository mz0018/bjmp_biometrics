from fastapi import APIRouter
from app.models.face_model import FaceData

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
        return {
            "status": "error",
            "errors": errors
        }

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
        "received_images": len(data.images),
    }
