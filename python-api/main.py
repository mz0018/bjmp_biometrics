import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

PORT = int(os.getenv("PORT", 5000))
ORIGIN_URL = os.getenv("ORIGIN_URL", "http://localhost:5173")

app = FastAPI(title="Face Recognition API (Dev)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ORIGIN_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/ping")
async def ping():
    return {"message": "pong", "status": "ok"}

class FaceData(BaseModel):
    images: list[str]
    id: str
    first_name: str
    last_name: str

@app.post("/api/register-face")
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
