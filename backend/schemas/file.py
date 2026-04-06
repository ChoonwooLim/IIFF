from datetime import datetime
from pydantic import BaseModel


class FileResponse(BaseModel):
    id: int
    original_name: str
    stored_name: str
    file_size: int
    mime_type: str
    created_at: datetime
    model_config = {"from_attributes": True}
