from datetime import datetime
from pydantic import BaseModel, field_validator


class MeetingCreateRequest(BaseModel):
    name: str
    type: str  # "video" or "text"
    max_participants: int = 10

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if len(v.strip()) < 1 or len(v) > 200:
            raise ValueError("회의실 이름은 1~200자여야 합니다")
        return v.strip()

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in ("video", "text"):
            raise ValueError("타입은 video 또는 text만 가능합니다")
        return v

    @field_validator("max_participants")
    @classmethod
    def validate_max(cls, v: int) -> int:
        if v < 2 or v > 50:
            raise ValueError("참여 인원은 2~50명이어야 합니다")
        return v


class MeetingUserResponse(BaseModel):
    id: int
    nickname: str
    profile_image: str | None
    model_config = {"from_attributes": True}


class ParticipantResponse(BaseModel):
    id: int
    user: MeetingUserResponse
    joined_at: datetime
    left_at: datetime | None
    model_config = {"from_attributes": True}


class MeetingResponse(BaseModel):
    id: int
    name: str
    type: str
    status: str
    max_participants: int
    jitsi_room_id: str | None
    creator: MeetingUserResponse
    participant_count: int = 0
    created_at: datetime
    closed_at: datetime | None
    model_config = {"from_attributes": True}


class MeetingDetailResponse(BaseModel):
    id: int
    name: str
    type: str
    status: str
    max_participants: int
    jitsi_room_id: str | None
    creator: MeetingUserResponse
    participants: list[ParticipantResponse] = []
    created_at: datetime
    closed_at: datetime | None
    model_config = {"from_attributes": True}


class ChatMessageResponse(BaseModel):
    id: int
    user: MeetingUserResponse
    content: str
    created_at: datetime
    model_config = {"from_attributes": True}
