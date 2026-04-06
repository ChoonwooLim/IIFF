from datetime import datetime
from sqlalchemy import String, Integer, Enum, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    type: Mapped[str] = mapped_column(
        Enum("video", "text", name="meeting_type_enum", create_constraint=True),
        nullable=False,
    )
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    status: Mapped[str] = mapped_column(
        Enum("active", "closed", name="meeting_status_enum", create_constraint=True),
        default="active",
        server_default="active",
    )
    max_participants: Mapped[int] = mapped_column(Integer, default=10, server_default="10")
    jitsi_room_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    closed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    creator: Mapped["User"] = relationship()
    participants: Mapped[list["MeetingParticipant"]] = relationship(back_populates="meeting", cascade="all, delete-orphan")
    messages: Mapped[list["ChatMessage"]] = relationship(back_populates="meeting", cascade="all, delete-orphan")
