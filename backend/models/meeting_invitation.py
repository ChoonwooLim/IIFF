from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


class MeetingInvitation(Base):
    __tablename__ = "meeting_invitations"
    __table_args__ = (
        UniqueConstraint("meeting_id", "user_id", name="uq_meeting_invitation"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    meeting_id: Mapped[int] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    invited_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    invited_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    meeting: Mapped["Meeting"] = relationship(overlaps="invitations")
    user: Mapped["User"] = relationship(foreign_keys=[user_id])
    inviter: Mapped["User"] = relationship(foreign_keys=[invited_by])
