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


class MeetingUpdateRequest(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if len(v.strip()) < 1 or len(v) > 200:
            raise ValueError("회의실 이름은 1~200자여야 합니다")
        return v.strip()


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


class MeetingPasswordRequest(BaseModel):
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v.strip()) < 1 or len(v) > 50:
            raise ValueError("비밀번호는 1~50자여야 합니다")
        return v.strip()


class MeetingJoinRequest(BaseModel):
    password: str | None = None


class MeetingResponse(BaseModel):
    id: int
    name: str
    type: str
    status: str
    max_participants: int
    has_password: bool = False
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


class MeetingInviteRequest(BaseModel):
    user_id: int


class MeetingInvitationResponse(BaseModel):
    id: int
    user: MeetingUserResponse
    invited_at: datetime
    model_config = {"from_attributes": True}


class MeetingMinutesResponse(BaseModel):
    id: int
    meeting_id: int
    title: str
    content: str
    creator: MeetingUserResponse
    created_at: datetime
    model_config = {"from_attributes": True}


class MeetingMinutesListItem(BaseModel):
    id: int
    meeting_id: int
    title: str
    creator: MeetingUserResponse
    created_at: datetime
    model_config = {"from_attributes": True}


class ChatMessageResponse(BaseModel):
    id: int
    user: MeetingUserResponse
    content: str
    file_url: str | None = None
    file_name: str | None = None
    file_type: str | None = None
    file_size: int | None = None
    created_at: datetime
    model_config = {"from_attributes": True}
