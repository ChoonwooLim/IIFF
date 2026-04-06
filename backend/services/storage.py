import os
import uuid
import subprocess
import logging
from abc import ABC, abstractmethod
from fastapi import UploadFile, HTTPException
from config import settings

logger = logging.getLogger(__name__)


class StorageBackend(ABC):
    @abstractmethod
    def upload(self, file: UploadFile, directory: str) -> tuple[str, str, int]:
        """Upload file. Returns (stored_name, rel_path, file_size)."""

    @abstractmethod
    def delete(self, file_path: str) -> bool:
        """Delete file. Returns True if deleted."""

    @abstractmethod
    def get_path(self, file_path: str) -> str:
        """Get absolute path for serving."""


class LocalStorage(StorageBackend):
    def __init__(self, base_path: str | None = None):
        self.base_path = base_path or settings.storage_base_path

    def _ensure_dir(self, directory: str) -> str:
        full_dir = os.path.join(self.base_path, directory)
        os.makedirs(full_dir, exist_ok=True)
        return full_dir

    def upload(self, file: UploadFile, directory: str) -> tuple[str, str, int]:
        full_dir = self._ensure_dir(directory)
        ext = os.path.splitext(file.filename or "")[1].lower()
        stored_name = f"{uuid.uuid4()}{ext}"
        abs_path = os.path.join(full_dir, stored_name)
        content = file.file.read()
        file_size = len(content)
        with open(abs_path, "wb") as f:
            f.write(content)
        # Store relative path for cross-environment compatibility
        rel_path = f"{directory}/{stored_name}"
        # Sync to remote server if configured
        _sync_to_remote(abs_path, rel_path)
        return stored_name, rel_path, file_size

    def delete(self, file_path: str) -> bool:
        abs_path = os.path.join(self.base_path, file_path) if not os.path.isabs(file_path) else file_path
        if os.path.exists(abs_path):
            os.remove(abs_path)
            return True
        return False

    def get_path(self, file_path: str) -> str:
        if os.path.isabs(file_path):
            return file_path
        return os.path.join(self.base_path, file_path)


def _sync_to_remote(local_path: str, rel_path: str) -> None:
    """SCP file to remote server for deployment sync."""
    remote_host = os.environ.get("REMOTE_UPLOADS_HOST")
    remote_path = os.environ.get("REMOTE_UPLOADS_PATH")
    if not remote_host or not remote_path:
        return
    dest = f"{remote_host}:{remote_path}/{rel_path}"
    try:
        subprocess.Popen(
            ["scp", "-o", "StrictHostKeyChecking=no", local_path, dest],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
        )
        logger.info(f"SCP sync started: {rel_path} -> {dest}")
    except Exception as e:
        logger.warning(f"SCP sync failed for {rel_path}: {e}")


def get_storage() -> StorageBackend:
    return LocalStorage()


def validate_file(file: UploadFile, board_type: str) -> None:
    if not file.filename:
        raise HTTPException(status_code=400, detail="파일 이름이 없습니다")
    ext = os.path.splitext(file.filename)[1].lower()
    all_allowed = settings.allowed_image_extensions + settings.allowed_document_extensions
    if ext not in all_allowed:
        raise HTTPException(status_code=400, detail=f"허용되지 않는 파일 형식입니다: {ext}")
    content = file.file.read()
    file_size = len(content)
    file.file.seek(0)
    if ext in settings.allowed_image_extensions:
        if file_size > settings.max_file_size_image:
            raise HTTPException(status_code=400, detail="이미지 파일은 10MB 이하여야 합니다")
    else:
        if file_size > settings.max_file_size_document:
            raise HTTPException(status_code=400, detail="문서 파일은 50MB 이하여야 합니다")


def get_upload_directory(board_type: str, ext: str) -> str:
    if ext in settings.allowed_image_extensions:
        return "images"
    return "documents"
