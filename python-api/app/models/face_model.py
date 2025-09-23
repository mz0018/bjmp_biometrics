from typing import List, Optional
from pydantic import BaseModel, Field


class FaceData(BaseModel):
    id: str = Field(..., description="Admin ID")
    first_name: str = Field(..., description="Admin first name")
    last_name: str = Field(..., description="Admin last name")
    visitor_name: str = Field(..., description="Visitor name")
    inmate_name: str = Field(..., description="Inmate name")
    visitor_address: str = Field(..., description="Visitor address")
    # Use typing.List for Python 3.8 compatibility
    images: List[str] = Field(..., description="List of images (base64 strings)")
