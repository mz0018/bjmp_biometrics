from typing import List
from pydantic import BaseModel, Field

class InmateData(BaseModel):
    inmate_name: str = Field(..., description="Name of inmate to visit")
    relationship: str = Field(..., description="Relationship of visitor to inmate")

class FaceData(BaseModel):
    id: str = Field(..., description="Admin ID")
    first_name: str = Field(..., description="Admin first name")
    last_name: str = Field(..., description="Admin last name")
    visitor_name: str = Field(..., description="Visitor full name")
    visitor_address: str = Field(..., description="Visitor address")
    visitor_contact: str = Field(..., description="Visitor contact number")
    visitor_gender: str = Field(..., description="Visitor gender")
    inmates: List[InmateData] = Field(..., description="List of inmates to visit with relationship")
    images: List[str] = Field(..., description="List of captured images (base64 strings)")
