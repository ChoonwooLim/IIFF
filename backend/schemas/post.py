from datetime import datetime
from pydantic import BaseModel, field_validator
import re


class PostCreateRequest(BaseModel):
    board_id: int
    title: str
    content: str
    youtube_url: str | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        if len(v.strip()) < 1 or len(v) > 200:
            raise ValueError("제목은 1~200자여야 합니다")
        return v.strip()

    @field_validator("youtube_url")
    @classmethod
    def validate_youtube_url(cls, v: str | None) -> str | None:
        if v is None or v == "":
            return None
        youtube_pattern = r"(youtube\.com|youtu\.be)"
        if not re.search(youtube_pattern, v):
            raise ValueError("유효한 YouTube URL이 아닙니다")
        return v


class PostUpdateRequest(BaseModel):
    title: str | None = None
    content: str | None = None
    youtube_url: str | None = None


class PostUserResponse(BaseModel):
    id: int
    nickname: str
    profile_image: str | None
    model_config = {"from_attributes": True}


class PostFileResponse(BaseModel):
    id: int
    original_name: str
    file_size: int
    mime_type: str
    model_config = {"from_attributes": True}


class PostListResponse(BaseModel):
    id: int
    board_id: int
    title: str
    youtube_url: str | None
    is_pinned: bool
    view_count: int
    comment_count: int = 0
    file_count: int = 0
    user: PostUserResponse
    created_at: datetime
    model_config = {"from_attributes": True}


class PostDetailResponse(BaseModel):
    id: int
    board_id: int
    title: str
    content: str
    youtube_url: str | None
    is_pinned: bool
    is_hidden: bool
    view_count: int
    user: PostUserResponse
    files: list[PostFileResponse] = []
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


class PaginatedPostResponse(BaseModel):
    items: list[PostListResponse]
    total: int
    page: int
    pages: int
