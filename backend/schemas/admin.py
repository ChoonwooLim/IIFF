from pydantic import BaseModel, field_validator


class UserStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in ("active", "rejected", "banned"):
            raise ValueError("상태는 active, rejected, banned 중 하나여야 합니다")
        return v


class UserRoleUpdate(BaseModel):
    role: str

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in ("user", "admin"):
            raise ValueError("역할은 user 또는 admin이어야 합니다")
        return v


class DashboardStats(BaseModel):
    total_users: int
    pending_users: int
    active_users: int
    total_posts: int
    hidden_posts: int
    active_meetings: int
