from datetime import datetime
from sqlalchemy import String, Enum, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    auth_provider: Mapped[str] = mapped_column(
        Enum("local", "google", name="auth_provider_enum", create_constraint=True),
        nullable=False,
    )
    google_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    username: Mapped[str | None] = mapped_column(String(20), unique=True, nullable=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    nickname: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    profile_image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    role: Mapped[str] = mapped_column(
        String(20),
        default="guest",
        server_default="guest",
    )
    status: Mapped[str] = mapped_column(
        String(20),
        default="active",
        server_default="active",
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
