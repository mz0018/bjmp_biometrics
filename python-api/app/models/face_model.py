from pydantic import BaseModel

class FaceData(BaseModel):
    # Admin info
    id: str
    first_name: str
    last_name: str

    # Visitor info
    visitor_name: str
    inmate_name: str
    visitor_address: str

    # Captured images
    images: list[str]
