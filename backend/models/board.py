from sqlalchemy import String, Text, Enum, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


class Board(Base):
    __tablename__ = "boards"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    board_type: Mapped[str] = mapped_column(
        Enum("general", "image", "video", "archive", "qna",
             name="board_type_enum", create_constraint=True),
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")

    posts: Mapped[list["Post"]] = relationship(back_populates="board", cascade="all, delete-orphan")
