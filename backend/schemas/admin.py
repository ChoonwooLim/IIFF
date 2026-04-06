from pydantic import BaseModel, field_validator


class UserStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in ("active", "banned"):
            raise ValueError("상태는 active 또는 banned여야 합니다")
        return v


class UserRoleUpdate(BaseModel):
    role: str

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in ("guest", "vip", "vvip", "subadmin", "admin"):
            raise ValueError("등급은 guest, vip, vvip, subadmin, admin 중 하나여야 합니다")
        return v


class DashboardStats(BaseModel):
    total_users: int
    guest_users: int
    vip_users: int
    vvip_users: int
    active_users: int
    total_posts: int
    hidden_posts: int
    active_meetings: int
