from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.helpers.embedding_utils import preload_embeddings
from app.routes import face_routes

app = FastAPI(title="Face Recognition API")

# Allow frontend dev origins
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(face_routes.router, prefix="/api", tags=["Face Recognition"])

@app.get("/api/ping")
async def ping():
    return {"message": "pong"}

@app.on_event("startup")
async def startup_event():
    preload_embeddings("./saved_faces")  # load all embeddings into memory                  