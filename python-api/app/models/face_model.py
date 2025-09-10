from pydantic import BaseModel

class FaceData(BaseModel):
    images: list[str]
    id: str
    first_name: str
    last_name: str
    visitor_name: str
    inmate_name: str
    visitor_address: str
