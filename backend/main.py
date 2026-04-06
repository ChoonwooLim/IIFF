from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

app = FastAPI(title="IIFF API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from routers.auth import router as auth_router
from routers.boards import router as boards_router
from routers.posts import router as posts_router
from routers.comments import router as comments_router
from routers.meetings import router as meetings_router
from routers.chat import router as chat_router
from routers.admin import router as admin_router

app.include_router(auth_router)
app.include_router(boards_router)
app.include_router(posts_router)
app.include_router(comments_router)
app.include_router(meetings_router)
app.include_router(chat_router)
app.include_router(admin_router)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "iiff-api"}


# Serve uploaded files
import os
from fastapi.staticfiles import StaticFiles

upload_path = settings.storage_base_path
if os.path.isdir(upload_path):
    app.mount("/uploads", StaticFiles(directory=upload_path), name="uploads")
