from pydantic import BaseModel, field_validator
import re

class LocalRegisterRequest(BaseModel):
    username: str
    password: str
    email: str
    name: str
    nickname: str
    phone: str

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z0-9]{4,20}$", v):
            raise ValueError("아이디는 4~20자 영문+숫자만 가능합니다")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("비밀번호는 8자 이상이어야 합니다")
        if not re.search(r"[a-zA-Z]", v):
            raise ValueError("비밀번호에 영문자가 포함되어야 합니다")
        if not re.search(r"[0-9]", v):
            raise ValueError("비밀번호에 숫자가 포함되어야 합니다")
        if not re.search(r'[!@#$%^&*(),.?\":{}|<>]', v):
            raise ValueError("비밀번호에 특수문자가 포함되어야 합니다")
        return v

    @field_validator("nickname")
    @classmethod
    def validate_nickname(cls, v: str) -> str:
        if len(v) < 2 or len(v) > 20:
            raise ValueError("닉네임은 2~20자여야 합니다")
        return v

class LocalLoginRequest(BaseModel):
    username: str
    password: str

class GoogleCallbackRequest(BaseModel):
    code: str

class GoogleProfileCompleteRequest(BaseModel):
    nickname: str
    phone: str

    @field_validator("nickname")
    @classmethod
    def validate_nickname(cls, v: str) -> str:
        if len(v) < 2 or len(v) > 20:
            raise ValueError("닉네임은 2~20자여야 합니다")
        return v

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: int
    auth_provider: str
    email: str
    name: str
    nickname: str
    phone: str
    profile_image: str | None
    role: str
    status: str

    model_config = {"from_attributes": True}

class MessageResponse(BaseModel):
    message: str
    status: str | None = None
