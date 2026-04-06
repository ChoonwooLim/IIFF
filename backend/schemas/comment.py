from datetime import datetime
from pydantic import BaseModel, field_validator


class CommentCreateRequest(BaseModel):
    content: str
    parent_id: int | None = None

    @field_validator("content")
    @classmethod
    def validate_content(cls, v: str) -> str:
        if len(v.strip()) < 1:
            raise ValueError("댓글 내용을 입력해주세요")
        return v.strip()


class CommentUpdateRequest(BaseModel):
    content: str


class CommentUserResponse(BaseModel):
    id: int
    nickname: str
    profile_image: str | None
    model_config = {"from_attributes": True}


class CommentResponse(BaseModel):
    id: int
    post_id: int
    user: CommentUserResponse
    parent_id: int | None
    content: str
    is_adopted: bool
    is_hidden: bool
    created_at: datetime
    replies: list["CommentResponse"] = []
    model_config = {"from_attributes": True}
