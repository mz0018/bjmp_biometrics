from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import face_routes

app = FastAPI(title="Face Recognition API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(face_routes.router, prefix="/api", tags=["Face Recognition"])

@app.get("/api/ping")
async def ping():
    return {"message": "pong"}
