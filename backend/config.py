from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://iiff_user:iiff_secret_2026@localhost:5433/iiff_db"
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    google_client_id: str = ""
    google_client_secret: str = ""
    storage_base_path: str = "D:/DATA/iiff-uploads"
    allowed_origins: list[str] = ["http://localhost:5173"]

    # File upload
    max_file_size_image: int = 10 * 1024 * 1024      # 10 MB
    max_file_size_document: int = 50 * 1024 * 1024    # 50 MB
    max_files_per_post: int = 10
    allowed_image_extensions: list[str] = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
    allowed_document_extensions: list[str] = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".hwp"]

    model_config = {"env_file": "../.env", "extra": "ignore"}


settings = Settings()
