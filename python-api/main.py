from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.helpers.embedding_utils import preload_embeddings
from app.routes import face_routes
from app.ws_manager import clients

app = FastAPI(title="Face Recognition API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(face_routes.router, prefix="/api", tags=["Face Recognition"])

@app.get("/api/ping")
async def ping():
    return {"message": "pong"}

@app.on_event("startup")
async def startup_event():
    preload_embeddings("./saved_faces")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    origin = websocket.headers.get("origin")
    if origin not in origins:
        await websocket.close(code=403)
        return

    await websocket.accept()
    clients.append(websocket)
    print(f"WebSocket connected: {origin}")

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        clients.remove(websocket)
        print("WebSocket disconnected")
