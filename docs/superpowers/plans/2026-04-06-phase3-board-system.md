# Phase 3: Board System — 6종 게시판 + 파일 업로드

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 6종 게시판 (공지사항, 건의사항, 이미지, 동영상, 자료실, Q&A) CRUD, 댓글/대댓글, 파일 업로드/다운로드, Q&A 채택 기능, 프론트엔드 게시판 UI 구현.

**Architecture:** Board/Post/Comment/File 4개 모델. 게시판 타입별 비즈니스 로직은 라우터에서 분기. 파일 저장은 StorageBackend 추상 클래스 + LocalStorage 구현. 프론트엔드는 게시판 목록/상세/작성 페이지.

**Tech Stack:** FastAPI, SQLAlchemy 2.0, Alembic, python-multipart, aiofiles, React, React Router, axios, Tailwind CSS

---

## File Structure

### Backend — New/Modified Files

```
backend/
├── models/
│   ├── __init__.py            # (modify) import Board, Post, Comment, File
│   ├── board.py               # Board model
│   ├── post.py                # Post model
│   └── comment.py             # Comment model
│   └── file.py                # File model
├── routers/
│   ├── boards.py              # Board listing
│   ├── posts.py               # Post CRUD + file upload
│   └── comments.py            # Comment CRUD + Q&A adopt
├── schemas/
│   ├── board.py               # Board response schemas
│   ├── post.py                # Post request/response schemas
│   ├── comment.py             # Comment request/response schemas
│   └── file.py                # File response schemas
├── services/
│   └── storage.py             # StorageBackend ABC + LocalStorage
├── config.py                  # (modify) add file upload settings
├── main.py                    # (modify) mount new routers
├── scripts/
│   └── seed_boards.py         # Seed 6 boards
└── tests/
    ├── test_board_model.py
    ├── test_post_crud.py
    ├── test_comment_crud.py
    ├── test_file_upload.py
    └── test_qna_adopt.py
```

### Frontend — New Files

```
frontend/src/
├── pages/
│   └── Board/
│       ├── BoardListPage.tsx       # 게시판 목록 (게시판 선택)
│       ├── PostListPage.tsx        # 게시글 목록 (특정 게시판)
│       ├── PostDetailPage.tsx      # 게시글 상세 + 댓글
│       └── PostCreatePage.tsx      # 게시글 작성/수정
├── components/
│   └── board/
│       ├── PostCard.tsx            # 게시글 카드 (목록용)
│       ├── CommentSection.tsx      # 댓글 섹션
│       ├── CommentItem.tsx         # 댓글 아이템 (재귀 대댓글)
│       ├── FileUploader.tsx        # 파일 업로드 UI
│       ├── FileList.tsx            # 첨부파일 목록
│       ├── ImageGallery.tsx        # 이미지 갤러리 (이미지 게시판)
│       └── YouTubeEmbed.tsx        # YouTube 임베드 (동영상 게시판)
└── App.tsx                         # (modify) add board routes
```

---

## Task 1: Board + Post + Comment + File Models + Migration

**Files:**
- Create: `backend/models/board.py`
- Create: `backend/models/post.py`
- Create: `backend/models/comment.py`
- Create: `backend/models/file.py`
- Modify: `backend/models/__init__.py`
- Create: Alembic migration (auto-generated)
- Create: `backend/tests/test_board_model.py`

- [ ] **Step 1: Create Board model**

```python
# backend/models/board.py
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
```

- [ ] **Step 2: Create Post model**

```python
# backend/models/post.py
from datetime import datetime

from sqlalchemy import String, Text, Integer, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    board_id: Mapped[int] = mapped_column(ForeignKey("boards.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    youtube_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_pinned: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    is_hidden: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    view_count: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    board: Mapped["Board"] = relationship(back_populates="posts")
    user: Mapped["User"] = relationship()
    comments: Mapped[list["Comment"]] = relationship(back_populates="post", cascade="all, delete-orphan")
    files: Mapped[list["File"]] = relationship(back_populates="post", cascade="all, delete-orphan")
```

- [ ] **Step 3: Create Comment model**

```python
# backend/models/comment.py
from datetime import datetime

from sqlalchemy import Text, Integer, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    parent_id: Mapped[int | None] = mapped_column(ForeignKey("comments.id"), nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_adopted: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    is_hidden: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    post: Mapped["Post"] = relationship(back_populates="comments")
    user: Mapped["User"] = relationship()
    parent: Mapped["Comment | None"] = relationship(remote_side=[id], back_populates="replies")
    replies: Mapped[list["Comment"]] = relationship(back_populates="parent")
```

- [ ] **Step 4: Create File model**

```python
# backend/models/file.py
from datetime import datetime

from sqlalchemy import String, BigInteger, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class File(Base):
    __tablename__ = "files"

    id: Mapped[int] = mapped_column(primary_key=True)
    post_id: Mapped[int | None] = mapped_column(ForeignKey("posts.id"), nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    original_name: Mapped[str] = mapped_column(String(255), nullable=False)
    stored_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    file_size: Mapped[int] = mapped_column(BigInteger, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    post: Mapped["Post | None"] = relationship(back_populates="files")
    user: Mapped["User"] = relationship()
```

- [ ] **Step 5: Update models/__init__.py**

```python
# backend/models/__init__.py
from database import Base
from models.user import User
from models.board import Board
from models.post import Post
from models.comment import Comment
from models.file import File

__all__ = ["Base", "User", "Board", "Post", "Comment", "File"]
```

- [ ] **Step 6: Write model tests**

```python
# backend/tests/test_board_model.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from models.board import Board
from models.post import Post
from models.comment import Comment
from models.file import File
from models.user import User

engine_test = create_engine("sqlite:///./test_board.db", connect_args={"check_same_thread": False})
TestSession = sessionmaker(bind=engine_test)


@pytest.fixture(scope="module", autouse=True)
def setup():
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)
    import os
    engine_test.dispose()
    os.remove("./test_board.db") if os.path.exists("./test_board.db") else None


@pytest.fixture()
def db():
    session = TestSession()
    yield session
    session.rollback()
    session.close()


def test_create_board(db):
    board = Board(slug="notice", name="공지사항", board_type="general")
    db.add(board)
    db.commit()
    db.refresh(board)
    assert board.id is not None
    assert board.slug == "notice"
    assert board.is_active is True


def test_create_post_with_board(db):
    board = Board(slug="test-board", name="테스트", board_type="general")
    db.add(board)
    db.commit()

    user = User(
        auth_provider="local", username="poster", password_hash="hash",
        email="poster@test.com", name="작성자", nickname="포스터", phone="010-0000-0000",
    )
    db.add(user)
    db.commit()

    post = Post(board_id=board.id, user_id=user.id, title="테스트 글", content="내용입니다")
    db.add(post)
    db.commit()
    db.refresh(post)

    assert post.id is not None
    assert post.view_count == 0
    assert post.is_pinned is False


def test_create_comment_with_reply(db):
    board = Board(slug="comment-board", name="댓글테스트", board_type="general")
    db.add(board)
    db.commit()

    user = User(
        auth_provider="local", username="commenter", password_hash="hash",
        email="commenter@test.com", name="댓글러", nickname="코멘터", phone="010-1111-1111",
    )
    db.add(user)
    db.commit()

    post = Post(board_id=board.id, user_id=user.id, title="댓글 테스트", content="본문")
    db.add(post)
    db.commit()

    comment = Comment(post_id=post.id, user_id=user.id, content="첫 댓글")
    db.add(comment)
    db.commit()

    reply = Comment(post_id=post.id, user_id=user.id, parent_id=comment.id, content="대댓글")
    db.add(reply)
    db.commit()
    db.refresh(reply)

    assert reply.parent_id == comment.id


def test_create_file(db):
    user = User(
        auth_provider="local", username="uploader", password_hash="hash",
        email="uploader@test.com", name="업로더", nickname="업로더", phone="010-2222-2222",
    )
    db.add(user)
    db.commit()

    file = File(
        user_id=user.id, original_name="test.pdf",
        stored_name="uuid-123.pdf", file_path="/uploads/uuid-123.pdf",
        file_size=1024, mime_type="application/pdf",
    )
    db.add(file)
    db.commit()
    db.refresh(file)

    assert file.id is not None
    assert file.post_id is None
```

- [ ] **Step 7: Run tests**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/test_board_model.py -v`
Expected: 5 passed.

- [ ] **Step 8: Generate and apply Alembic migration**

```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m alembic revision --autogenerate -m "create boards, posts, comments, files tables"
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m alembic upgrade head
```

- [ ] **Step 9: Verify tables**

```bash
docker compose exec postgres psql -U iiff_user -d iiff_db -c "\dt"
```
Expected: boards, posts, comments, files tables created.

- [ ] **Step 10: Commit**

```bash
cd c:\WORK\IIFF && git add backend/models/ backend/tests/test_board_model.py backend/alembic/ && git commit -m "feat(backend): add Board, Post, Comment, File models with migration"
```

---

## Task 2: Schemas (Board, Post, Comment, File)

**Files:**
- Create: `backend/schemas/board.py`
- Create: `backend/schemas/post.py`
- Create: `backend/schemas/comment.py`
- Create: `backend/schemas/file.py`

- [ ] **Step 1: Create board schemas**

```python
# backend/schemas/board.py
from pydantic import BaseModel


class BoardResponse(BaseModel):
    id: int
    slug: str
    name: str
    description: str | None
    board_type: str
    is_active: bool

    model_config = {"from_attributes": True}
```

- [ ] **Step 2: Create post schemas**

```python
# backend/schemas/post.py
from datetime import datetime
from pydantic import BaseModel, field_validator
import re


class PostCreateRequest(BaseModel):
    board_id: int
    title: str
    content: str
    youtube_url: str | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        if len(v.strip()) < 1 or len(v) > 200:
            raise ValueError("제목은 1~200자여야 합니다")
        return v.strip()

    @field_validator("youtube_url")
    @classmethod
    def validate_youtube_url(cls, v: str | None) -> str | None:
        if v is None or v == "":
            return None
        youtube_pattern = r"(youtube\.com|youtu\.be)"
        if not re.search(youtube_pattern, v):
            raise ValueError("유효한 YouTube URL이 아닙니다")
        return v


class PostUpdateRequest(BaseModel):
    title: str | None = None
    content: str | None = None
    youtube_url: str | None = None


class PostUserResponse(BaseModel):
    id: int
    nickname: str
    profile_image: str | None

    model_config = {"from_attributes": True}


class PostFileResponse(BaseModel):
    id: int
    original_name: str
    file_size: int
    mime_type: str

    model_config = {"from_attributes": True}


class PostListResponse(BaseModel):
    id: int
    board_id: int
    title: str
    youtube_url: str | None
    is_pinned: bool
    view_count: int
    comment_count: int = 0
    file_count: int = 0
    user: PostUserResponse
    created_at: datetime

    model_config = {"from_attributes": True}


class PostDetailResponse(BaseModel):
    id: int
    board_id: int
    title: str
    content: str
    youtube_url: str | None
    is_pinned: bool
    is_hidden: bool
    view_count: int
    user: PostUserResponse
    files: list[PostFileResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PaginatedPostResponse(BaseModel):
    items: list[PostListResponse]
    total: int
    page: int
    pages: int
```

- [ ] **Step 3: Create comment schemas**

```python
# backend/schemas/comment.py
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
```

- [ ] **Step 4: Create file schemas**

```python
# backend/schemas/file.py
from datetime import datetime
from pydantic import BaseModel


class FileResponse(BaseModel):
    id: int
    original_name: str
    stored_name: str
    file_size: int
    mime_type: str
    created_at: datetime

    model_config = {"from_attributes": True}
```

- [ ] **Step 5: Commit**

```bash
cd c:\WORK\IIFF && git add backend/schemas/ && git commit -m "feat(backend): add board, post, comment, file Pydantic schemas"
```

---

## Task 3: Storage Service + Config Update

**Files:**
- Create: `backend/services/storage.py`
- Modify: `backend/config.py`
- Create: `backend/tests/test_storage.py`

- [ ] **Step 1: Update config.py with file upload settings**

Add these fields to the `Settings` class in `backend/config.py`:

```python
    # File upload
    storage_base_path: str = "D:/DATA/iiff-uploads"
    max_file_size_image: int = 10 * 1024 * 1024      # 10 MB
    max_file_size_document: int = 50 * 1024 * 1024    # 50 MB
    max_files_per_post: int = 10
    allowed_image_extensions: list[str] = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
    allowed_document_extensions: list[str] = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".hwp"]
```

- [ ] **Step 2: Create storage service**

```python
# backend/services/storage.py
import os
import uuid
from abc import ABC, abstractmethod

from fastapi import UploadFile, HTTPException

from config import settings


class StorageBackend(ABC):
    @abstractmethod
    def upload(self, file: UploadFile, directory: str) -> tuple[str, str, int]:
        """Upload file. Returns (stored_name, file_path, file_size)."""

    @abstractmethod
    def delete(self, file_path: str) -> bool:
        """Delete file. Returns True if deleted."""

    @abstractmethod
    def get_path(self, file_path: str) -> str:
        """Get absolute path for serving."""


class LocalStorage(StorageBackend):
    def __init__(self, base_path: str | None = None):
        self.base_path = base_path or settings.storage_base_path

    def _ensure_dir(self, directory: str) -> str:
        full_dir = os.path.join(self.base_path, directory)
        os.makedirs(full_dir, exist_ok=True)
        return full_dir

    def upload(self, file: UploadFile, directory: str) -> tuple[str, str, int]:
        full_dir = self._ensure_dir(directory)
        ext = os.path.splitext(file.filename or "")[1].lower()
        stored_name = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(full_dir, stored_name)

        content = file.file.read()
        file_size = len(content)

        with open(file_path, "wb") as f:
            f.write(content)

        return stored_name, file_path, file_size

    def delete(self, file_path: str) -> bool:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False

    def get_path(self, file_path: str) -> str:
        return file_path


def get_storage() -> StorageBackend:
    return LocalStorage()


def validate_file(file: UploadFile, board_type: str) -> None:
    """Validate file extension and size based on board type."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="파일 이름이 없습니다")

    ext = os.path.splitext(file.filename)[1].lower()
    all_allowed = settings.allowed_image_extensions + settings.allowed_document_extensions

    if ext not in all_allowed:
        raise HTTPException(status_code=400, detail=f"허용되지 않는 파일 형식입니다: {ext}")

    # Read to check size, then seek back
    content = file.file.read()
    file_size = len(content)
    file.file.seek(0)

    if ext in settings.allowed_image_extensions:
        if file_size > settings.max_file_size_image:
            raise HTTPException(status_code=400, detail="이미지 파일은 10MB 이하여야 합니다")
    else:
        if file_size > settings.max_file_size_document:
            raise HTTPException(status_code=400, detail="문서 파일은 50MB 이하여야 합니다")


def get_upload_directory(board_type: str, ext: str) -> str:
    """Determine upload subdirectory based on board type and file extension."""
    if ext in settings.allowed_image_extensions:
        return "images"
    return "documents"
```

- [ ] **Step 3: Write storage tests**

```python
# backend/tests/test_storage.py
import os
import tempfile
import pytest
from io import BytesIO
from unittest.mock import MagicMock

from services.storage import LocalStorage, validate_file, get_upload_directory
from config import settings


@pytest.fixture()
def temp_storage():
    with tempfile.TemporaryDirectory() as tmpdir:
        storage = LocalStorage(base_path=tmpdir)
        yield storage, tmpdir


def _make_upload_file(filename: str, content: bytes) -> MagicMock:
    mock = MagicMock()
    mock.filename = filename
    mock.file = BytesIO(content)
    mock.content_type = "application/octet-stream"
    return mock


def test_upload_file(temp_storage):
    storage, tmpdir = temp_storage
    fake_file = _make_upload_file("test.pdf", b"hello world")
    stored_name, file_path, file_size = storage.upload(fake_file, "documents")

    assert stored_name.endswith(".pdf")
    assert os.path.exists(file_path)
    assert file_size == 11


def test_delete_file(temp_storage):
    storage, tmpdir = temp_storage
    fake_file = _make_upload_file("delete_me.txt", b"data")
    _, file_path, _ = storage.upload(fake_file, "documents")

    assert storage.delete(file_path) is True
    assert not os.path.exists(file_path)


def test_delete_nonexistent_file(temp_storage):
    storage, _ = temp_storage
    assert storage.delete("/nonexistent/file.txt") is False


def test_get_upload_directory():
    assert get_upload_directory("image", ".jpg") == "images"
    assert get_upload_directory("archive", ".pdf") == "documents"
    assert get_upload_directory("general", ".png") == "images"
```

- [ ] **Step 4: Run tests**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/test_storage.py -v`
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
cd c:\WORK\IIFF && git add backend/services/storage.py backend/config.py backend/tests/test_storage.py && git commit -m "feat(backend): add file storage service with LocalStorage and validation"
```

---

## Task 4: Board Seeding Script

**Files:**
- Create: `backend/scripts/seed_boards.py`

- [ ] **Step 1: Create seed script**

```python
# backend/scripts/seed_boards.py
"""Create the 6 default boards. Run once after migration."""
import sys
sys.path.insert(0, ".")

from database import SessionLocal
from models.board import Board


BOARDS = [
    {"slug": "notice", "name": "공지사항", "description": "공식 공지사항 게시판입니다.", "board_type": "general"},
    {"slug": "suggestion", "name": "건의사항", "description": "건의사항을 자유롭게 남겨주세요.", "board_type": "general"},
    {"slug": "image", "name": "이미지 게시판", "description": "이미지를 공유하는 게시판입니다.", "board_type": "image"},
    {"slug": "video", "name": "동영상 게시판", "description": "YouTube 영상을 공유하는 게시판입니다.", "board_type": "video"},
    {"slug": "archive", "name": "자료실", "description": "파일을 공유하는 자료실입니다.", "board_type": "archive"},
    {"slug": "qna", "name": "Q&A", "description": "질문과 답변 게시판입니다.", "board_type": "qna"},
]


def seed_boards():
    db = SessionLocal()
    try:
        for board_data in BOARDS:
            existing = db.query(Board).filter(Board.slug == board_data["slug"]).first()
            if existing:
                print(f"  Board '{board_data['slug']}' already exists, skipping.")
                continue
            board = Board(**board_data)
            db.add(board)
            print(f"  Created board: {board_data['name']} ({board_data['slug']})")
        db.commit()
        print("Board seeding complete.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_boards()
```

- [ ] **Step 2: Run seed script**

```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python scripts/seed_boards.py
```
Expected: 6 boards created.

- [ ] **Step 3: Verify in database**

```bash
docker compose exec postgres psql -U iiff_user -d iiff_db -c "SELECT id, slug, name, board_type FROM boards;"
```

- [ ] **Step 4: Commit**

```bash
cd c:\WORK\IIFF && git add backend/scripts/seed_boards.py && git commit -m "feat(backend): add board seeding script for 6 default boards"
```

---

## Task 5: Posts Router (CRUD + File Upload)

**Files:**
- Create: `backend/routers/boards.py`
- Create: `backend/routers/posts.py`
- Modify: `backend/main.py`
- Create: `backend/tests/test_post_crud.py`

- [ ] **Step 1: Create boards router**

```python
# backend/routers/boards.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from deps import get_db
from models.board import Board
from schemas.board import BoardResponse

router = APIRouter(prefix="/api/boards", tags=["boards"])


@router.get("", response_model=list[BoardResponse])
def list_boards(db: Session = Depends(get_db)):
    boards = db.query(Board).filter(Board.is_active == True).all()
    return boards
```

- [ ] **Step 2: Create posts router**

```python
# backend/routers/posts.py
import math

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File as FastAPIFile, Form, status
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from deps import get_db, get_current_user, require_active
from models.board import Board
from models.post import Post
from models.comment import Comment
from models.file import File
from models.user import User
from schemas.post import (
    PostCreateRequest,
    PostUpdateRequest,
    PostDetailResponse,
    PostListResponse,
    PaginatedPostResponse,
    PostUserResponse,
    PostFileResponse,
)
from services.storage import get_storage, validate_file, get_upload_directory

router = APIRouter(prefix="/api", tags=["posts"])


@router.get("/boards/{board_slug}/posts", response_model=PaginatedPostResponse)
def list_posts(
    board_slug: str,
    page: int = 1,
    per_page: int = 20,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    board = db.query(Board).filter(Board.slug == board_slug, Board.is_active == True).first()
    if not board:
        raise HTTPException(status_code=404, detail="게시판을 찾을 수 없습니다")

    query = db.query(Post).filter(Post.board_id == board.id, Post.is_hidden == False)

    if search:
        query = query.filter(Post.title.ilike(f"%{search}%"))

    total = query.count()
    pages = math.ceil(total / per_page) if total > 0 else 1

    posts = (
        query
        .options(joinedload(Post.user), joinedload(Post.comments), joinedload(Post.files))
        .order_by(Post.is_pinned.desc(), Post.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    items = []
    for post in posts:
        items.append(PostListResponse(
            id=post.id,
            board_id=post.board_id,
            title=post.title,
            youtube_url=post.youtube_url,
            is_pinned=post.is_pinned,
            view_count=post.view_count,
            comment_count=len([c for c in post.comments if not c.is_hidden]),
            file_count=len(post.files),
            user=PostUserResponse.model_validate(post.user),
            created_at=post.created_at,
        ))

    return PaginatedPostResponse(items=items, total=total, page=page, pages=pages)


@router.post("/posts", status_code=status.HTTP_201_CREATED)
def create_post(
    board_id: int = Form(...),
    title: str = Form(...),
    content: str = Form(...),
    youtube_url: str | None = Form(None),
    files: list[UploadFile] = FastAPIFile(default=[]),
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="게시판을 찾을 수 없습니다")

    # Notice board: admin only
    if board.slug == "notice" and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="공지사항은 관리자만 작성할 수 있습니다")

    # Video board: youtube_url required
    if board.board_type == "video" and not youtube_url:
        raise HTTPException(status_code=400, detail="동영상 게시판은 YouTube URL이 필요합니다")

    # File count check
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="파일은 최대 10개까지 첨부할 수 있습니다")

    # Validate title
    if len(title.strip()) < 1 or len(title) > 200:
        raise HTTPException(status_code=400, detail="제목은 1~200자여야 합니다")

    post = Post(
        board_id=board_id,
        user_id=current_user.id,
        title=title.strip(),
        content=content,
        youtube_url=youtube_url,
    )
    db.add(post)
    db.flush()  # Get post.id before file upload

    # Upload files
    storage = get_storage()
    for upload_file in files:
        if not upload_file.filename:
            continue
        validate_file(upload_file, board.board_type)
        ext = upload_file.filename.rsplit(".", 1)[-1].lower() if "." in upload_file.filename else ""
        directory = get_upload_directory(board.board_type, f".{ext}")
        stored_name, file_path, file_size = storage.upload(upload_file, directory)

        db_file = File(
            post_id=post.id,
            user_id=current_user.id,
            original_name=upload_file.filename,
            stored_name=stored_name,
            file_path=file_path,
            file_size=file_size,
            mime_type=upload_file.content_type or "application/octet-stream",
        )
        db.add(db_file)

    db.commit()
    db.refresh(post)

    return {"id": post.id, "title": post.title, "message": "게시글이 작성되었습니다"}


@router.get("/posts/{post_id}", response_model=PostDetailResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = (
        db.query(Post)
        .options(joinedload(Post.user), joinedload(Post.files))
        .filter(Post.id == post_id, Post.is_hidden == False)
        .first()
    )
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

    post.view_count += 1
    db.commit()

    return post


@router.patch("/posts/{post_id}")
def update_post(
    post_id: int,
    req: PostUpdateRequest,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

    if post.user_id != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="수정 권한이 없습니다")

    if req.title is not None:
        post.title = req.title.strip()
    if req.content is not None:
        post.content = req.content
    if req.youtube_url is not None:
        post.youtube_url = req.youtube_url

    db.commit()
    return {"message": "수정되었습니다"}


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

    if post.user_id != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="삭제 권한이 없습니다")

    # Delete associated files from storage
    storage = get_storage()
    for file in post.files:
        storage.delete(file.file_path)

    db.delete(post)
    db.commit()
```

- [ ] **Step 3: Create file download endpoint — add to posts router**

```python
@router.get("/files/{file_id}/download")
def download_file(file_id: int, db: Session = Depends(get_db)):
    from fastapi.responses import FileResponse as FastAPIFileResponse

    file = db.query(File).filter(File.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다")

    storage = get_storage()
    path = storage.get_path(file.file_path)

    import os
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="파일이 존재하지 않습니다")

    return FastAPIFileResponse(
        path=path,
        filename=file.original_name,
        media_type=file.mime_type,
    )
```

- [ ] **Step 4: Mount routers in main.py**

Add to `backend/main.py`:

```python
from routers.boards import router as boards_router
from routers.posts import router as posts_router

app.include_router(boards_router)
app.include_router(posts_router)
```

- [ ] **Step 5: Write post CRUD tests**

```python
# backend/tests/test_post_crud.py
import pytest


def _register_and_activate(client, username, email, nickname):
    """Helper: register user and activate them."""
    client.post("/api/auth/register", json={
        "username": username, "password": "Pass1234!",
        "email": email, "name": "테스트유저",
        "nickname": nickname, "phone": "010-0000-0000",
    })
    from tests.conftest import override_activate_user
    override_activate_user(client, username)
    resp = client.post("/api/auth/login", json={
        "username": username, "password": "Pass1234!",
    })
    return resp.json()["access_token"]


def test_list_boards(client):
    # Seed boards in test DB
    from models.board import Board
    from deps import get_db
    from main import app
    db = next(app.dependency_overrides[get_db]())
    for slug, name, btype in [
        ("notice", "공지사항", "general"),
        ("suggestion", "건의사항", "general"),
        ("image", "이미지", "image"),
    ]:
        if not db.query(Board).filter(Board.slug == slug).first():
            db.add(Board(slug=slug, name=name, board_type=btype))
    db.commit()

    response = client.get("/api/boards")
    assert response.status_code == 200
    assert len(response.json()) >= 3


def test_create_post(client):
    token = _register_and_activate(client, "postuser1", "post1@test.com", "포스트유저1")

    # Ensure suggestion board exists
    from models.board import Board
    from deps import get_db
    from main import app
    db = next(app.dependency_overrides[get_db]())
    board = db.query(Board).filter(Board.slug == "suggestion").first()
    if not board:
        board = Board(slug="suggestion", name="건의사항", board_type="general")
        db.add(board)
        db.commit()
        db.refresh(board)

    response = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "테스트 글", "content": "내용입니다"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    assert response.json()["title"] == "테스트 글"


def test_get_post(client):
    token = _register_and_activate(client, "postuser2", "post2@test.com", "포스트유저2")

    from models.board import Board
    from deps import get_db
    from main import app
    db = next(app.dependency_overrides[get_db]())
    board = db.query(Board).filter(Board.slug == "suggestion").first()

    resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "조회 테스트", "content": "본문"},
        headers={"Authorization": f"Bearer {token}"},
    )
    post_id = resp.json()["id"]

    response = client.get(f"/api/posts/{post_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "조회 테스트"
    assert response.json()["view_count"] == 1


def test_list_posts(client):
    response = client.get("/api/boards/suggestion/posts")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data


def test_notice_board_requires_admin(client):
    token = _register_and_activate(client, "normaluser", "normal@test.com", "일반유저")

    from models.board import Board
    from deps import get_db
    from main import app
    db = next(app.dependency_overrides[get_db]())
    board = db.query(Board).filter(Board.slug == "notice").first()

    response = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "공지 테스트", "content": "내용"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403


def test_delete_post(client):
    token = _register_and_activate(client, "deluser", "del@test.com", "삭제유저")

    from models.board import Board
    from deps import get_db
    from main import app
    db = next(app.dependency_overrides[get_db]())
    board = db.query(Board).filter(Board.slug == "suggestion").first()

    resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "삭제 테스트", "content": "삭제할 글"},
        headers={"Authorization": f"Bearer {token}"},
    )
    post_id = resp.json()["id"]

    response = client.delete(f"/api/posts/{post_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 204
```

- [ ] **Step 6: Run tests**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/test_post_crud.py -v`
Expected: 6 passed.

- [ ] **Step 7: Run all tests**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/ -v`
Expected: All pass.

- [ ] **Step 8: Commit**

```bash
cd c:\WORK\IIFF && git add backend/routers/ backend/main.py backend/tests/test_post_crud.py && git commit -m "feat(backend): add board listing and post CRUD with file upload endpoints"
```

---

## Task 6: Comments Router (CRUD + Q&A Adopt)

**Files:**
- Create: `backend/routers/comments.py`
- Modify: `backend/main.py`
- Create: `backend/tests/test_comment_crud.py`
- Create: `backend/tests/test_qna_adopt.py`

- [ ] **Step 1: Create comments router**

```python
# backend/routers/comments.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from deps import get_db, require_active
from models.post import Post
from models.comment import Comment
from models.board import Board
from models.user import User
from schemas.comment import CommentCreateRequest, CommentUpdateRequest, CommentResponse

router = APIRouter(prefix="/api", tags=["comments"])


@router.get("/posts/{post_id}/comments", response_model=list[CommentResponse])
def list_comments(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

    comments = (
        db.query(Comment)
        .options(joinedload(Comment.user), joinedload(Comment.replies).joinedload(Comment.user))
        .filter(Comment.post_id == post_id, Comment.parent_id == None, Comment.is_hidden == False)
        .order_by(Comment.is_adopted.desc(), Comment.created_at.asc())
        .all()
    )

    def build_comment(c: Comment) -> CommentResponse:
        return CommentResponse(
            id=c.id,
            post_id=c.post_id,
            user={"id": c.user.id, "nickname": c.user.nickname, "profile_image": c.user.profile_image},
            parent_id=c.parent_id,
            content=c.content,
            is_adopted=c.is_adopted,
            is_hidden=c.is_hidden,
            created_at=c.created_at,
            replies=[build_comment(r) for r in c.replies if not r.is_hidden],
        )

    return [build_comment(c) for c in comments]


@router.post("/posts/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    post_id: int,
    req: CommentCreateRequest,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    post = db.query(Post).filter(Post.id == post_id, Post.is_hidden == False).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

    if req.parent_id:
        parent = db.query(Comment).filter(Comment.id == req.parent_id, Comment.post_id == post_id).first()
        if not parent:
            raise HTTPException(status_code=404, detail="상위 댓글을 찾을 수 없습니다")

    comment = Comment(
        post_id=post_id,
        user_id=current_user.id,
        parent_id=req.parent_id,
        content=req.content,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    return CommentResponse(
        id=comment.id,
        post_id=comment.post_id,
        user={"id": current_user.id, "nickname": current_user.nickname, "profile_image": current_user.profile_image},
        parent_id=comment.parent_id,
        content=comment.content,
        is_adopted=comment.is_adopted,
        is_hidden=comment.is_hidden,
        created_at=comment.created_at,
        replies=[],
    )


@router.patch("/comments/{comment_id}")
def update_comment(
    comment_id: int,
    req: CommentUpdateRequest,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="댓글을 찾을 수 없습니다")

    if comment.user_id != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="수정 권한이 없습니다")

    comment.content = req.content
    db.commit()
    return {"message": "수정되었습니다"}


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="댓글을 찾을 수 없습니다")

    if comment.user_id != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="삭제 권한이 없습니다")

    db.delete(comment)
    db.commit()


@router.post("/comments/{comment_id}/adopt")
def adopt_comment(
    comment_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="댓글을 찾을 수 없습니다")

    post = db.query(Post).filter(Post.id == comment.post_id).first()
    board = db.query(Board).filter(Board.id == post.board_id).first()

    if board.board_type != "qna":
        raise HTTPException(status_code=400, detail="Q&A 게시판에서만 채택이 가능합니다")

    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="질문 작성자만 채택할 수 있습니다")

    # Unadopt any previously adopted comment
    db.query(Comment).filter(
        Comment.post_id == post.id, Comment.is_adopted == True
    ).update({"is_adopted": False})

    comment.is_adopted = True
    db.commit()

    return {"message": "답변이 채택되었습니다", "adopted_comment_id": comment.id}
```

- [ ] **Step 2: Mount comments router in main.py**

Add to `backend/main.py`:

```python
from routers.comments import router as comments_router

app.include_router(comments_router)
```

- [ ] **Step 3: Write comment tests**

```python
# backend/tests/test_comment_crud.py

def _register_and_activate(client, username, email, nickname):
    client.post("/api/auth/register", json={
        "username": username, "password": "Pass1234!",
        "email": email, "name": "테스트유저",
        "nickname": nickname, "phone": "010-0000-0000",
    })
    from tests.conftest import override_activate_user
    override_activate_user(client, username)
    resp = client.post("/api/auth/login", json={
        "username": username, "password": "Pass1234!",
    })
    return resp.json()["access_token"]


def _ensure_board(client, slug, name, board_type):
    from models.board import Board
    from deps import get_db
    from main import app
    db = next(app.dependency_overrides[get_db]())
    board = db.query(Board).filter(Board.slug == slug).first()
    if not board:
        board = Board(slug=slug, name=name, board_type=board_type)
        db.add(board)
        db.commit()
        db.refresh(board)
    return board


def test_create_comment(client):
    token = _register_and_activate(client, "cmtuser1", "cmt1@test.com", "댓글유저1")
    board = _ensure_board(client, "suggestion", "건의사항", "general")

    post_resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "댓글 테스트 글", "content": "본문"},
        headers={"Authorization": f"Bearer {token}"},
    )
    post_id = post_resp.json()["id"]

    response = client.post(f"/api/posts/{post_id}/comments",
        json={"content": "첫 댓글입니다"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    assert response.json()["content"] == "첫 댓글입니다"


def test_create_reply(client):
    token = _register_and_activate(client, "cmtuser2", "cmt2@test.com", "댓글유저2")
    board = _ensure_board(client, "suggestion", "건의사항", "general")

    post_resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "대댓글 테스트", "content": "본문"},
        headers={"Authorization": f"Bearer {token}"},
    )
    post_id = post_resp.json()["id"]

    cmt_resp = client.post(f"/api/posts/{post_id}/comments",
        json={"content": "부모 댓글"},
        headers={"Authorization": f"Bearer {token}"},
    )
    parent_id = cmt_resp.json()["id"]

    response = client.post(f"/api/posts/{post_id}/comments",
        json={"content": "대댓글입니다", "parent_id": parent_id},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    assert response.json()["parent_id"] == parent_id


def test_list_comments(client):
    token = _register_and_activate(client, "cmtuser3", "cmt3@test.com", "댓글유저3")
    board = _ensure_board(client, "suggestion", "건의사항", "general")

    post_resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "목록 테스트", "content": "본문"},
        headers={"Authorization": f"Bearer {token}"},
    )
    post_id = post_resp.json()["id"]

    client.post(f"/api/posts/{post_id}/comments",
        json={"content": "댓글1"},
        headers={"Authorization": f"Bearer {token}"},
    )
    client.post(f"/api/posts/{post_id}/comments",
        json={"content": "댓글2"},
        headers={"Authorization": f"Bearer {token}"},
    )

    response = client.get(f"/api/posts/{post_id}/comments")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_delete_comment(client):
    token = _register_and_activate(client, "cmtuser4", "cmt4@test.com", "댓글유저4")
    board = _ensure_board(client, "suggestion", "건의사항", "general")

    post_resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "삭제 댓글 테스트", "content": "본문"},
        headers={"Authorization": f"Bearer {token}"},
    )
    post_id = post_resp.json()["id"]

    cmt_resp = client.post(f"/api/posts/{post_id}/comments",
        json={"content": "삭제할 댓글"},
        headers={"Authorization": f"Bearer {token}"},
    )
    comment_id = cmt_resp.json()["id"]

    response = client.delete(f"/api/comments/{comment_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 204
```

- [ ] **Step 4: Write Q&A adopt test**

```python
# backend/tests/test_qna_adopt.py

def _register_and_activate(client, username, email, nickname):
    client.post("/api/auth/register", json={
        "username": username, "password": "Pass1234!",
        "email": email, "name": "테스트유저",
        "nickname": nickname, "phone": "010-0000-0000",
    })
    from tests.conftest import override_activate_user
    override_activate_user(client, username)
    resp = client.post("/api/auth/login", json={
        "username": username, "password": "Pass1234!",
    })
    return resp.json()["access_token"]


def _ensure_board(client, slug, name, board_type):
    from models.board import Board
    from deps import get_db
    from main import app
    db = next(app.dependency_overrides[get_db]())
    board = db.query(Board).filter(Board.slug == slug).first()
    if not board:
        board = Board(slug=slug, name=name, board_type=board_type)
        db.add(board)
        db.commit()
        db.refresh(board)
    return board


def test_adopt_answer(client):
    asker_token = _register_and_activate(client, "asker1", "asker1@test.com", "질문자")
    answerer_token = _register_and_activate(client, "answerer1", "answerer1@test.com", "답변자")

    board = _ensure_board(client, "qna", "Q&A", "qna")

    # Asker creates question
    post_resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "질문입니다", "content": "어떻게 해야 하나요?"},
        headers={"Authorization": f"Bearer {asker_token}"},
    )
    post_id = post_resp.json()["id"]

    # Answerer writes answer
    cmt_resp = client.post(f"/api/posts/{post_id}/comments",
        json={"content": "이렇게 하면 됩니다"},
        headers={"Authorization": f"Bearer {answerer_token}"},
    )
    comment_id = cmt_resp.json()["id"]

    # Asker adopts the answer
    response = client.post(f"/api/comments/{comment_id}/adopt",
        headers={"Authorization": f"Bearer {asker_token}"},
    )
    assert response.status_code == 200
    assert response.json()["adopted_comment_id"] == comment_id


def test_only_asker_can_adopt(client):
    asker_token = _register_and_activate(client, "asker2", "asker2@test.com", "질문자2")
    answerer_token = _register_and_activate(client, "answerer2", "answerer2@test.com", "답변자2")

    board = _ensure_board(client, "qna", "Q&A", "qna")

    post_resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "질문2", "content": "본문"},
        headers={"Authorization": f"Bearer {asker_token}"},
    )
    post_id = post_resp.json()["id"]

    cmt_resp = client.post(f"/api/posts/{post_id}/comments",
        json={"content": "답변"},
        headers={"Authorization": f"Bearer {answerer_token}"},
    )
    comment_id = cmt_resp.json()["id"]

    # Answerer tries to adopt their own answer — should fail
    response = client.post(f"/api/comments/{comment_id}/adopt",
        headers={"Authorization": f"Bearer {answerer_token}"},
    )
    assert response.status_code == 403


def test_adopt_only_on_qna_board(client):
    token = _register_and_activate(client, "noqna", "noqna@test.com", "비큐에이")
    board = _ensure_board(client, "suggestion", "건의사항", "general")

    post_resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "일반글", "content": "본문"},
        headers={"Authorization": f"Bearer {token}"},
    )
    post_id = post_resp.json()["id"]

    cmt_resp = client.post(f"/api/posts/{post_id}/comments",
        json={"content": "댓글"},
        headers={"Authorization": f"Bearer {token}"},
    )
    comment_id = cmt_resp.json()["id"]

    response = client.post(f"/api/comments/{comment_id}/adopt",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 400
```

- [ ] **Step 5: Run tests**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/test_comment_crud.py tests/test_qna_adopt.py -v`
Expected: 7 passed.

- [ ] **Step 6: Run all tests**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/ -v`

- [ ] **Step 7: Commit**

```bash
cd c:\WORK\IIFF && git add backend/ && git commit -m "feat(backend): add comment CRUD with nested replies and Q&A adopt feature"
```

---

## Task 7: Frontend — Board Pages (List, Detail, Create)

**Files:**
- Create: `frontend/src/pages/Board/BoardListPage.tsx`
- Create: `frontend/src/pages/Board/PostListPage.tsx`
- Create: `frontend/src/pages/Board/PostDetailPage.tsx`
- Create: `frontend/src/pages/Board/PostCreatePage.tsx`
- Create: `frontend/src/components/board/PostCard.tsx`
- Create: `frontend/src/components/board/CommentSection.tsx`
- Create: `frontend/src/components/board/CommentItem.tsx`
- Create: `frontend/src/components/board/FileUploader.tsx`
- Create: `frontend/src/components/board/FileList.tsx`
- Create: `frontend/src/components/board/ImageGallery.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Create PostCard component**

```tsx
// frontend/src/components/board/PostCard.tsx
import { Link } from "react-router-dom";

interface PostCardProps {
  id: number;
  boardSlug: string;
  title: string;
  user: { nickname: string };
  viewCount: number;
  commentCount: number;
  fileCount: number;
  isPinned: boolean;
  createdAt: string;
}

export default function PostCard({
  id, boardSlug, title, user, viewCount, commentCount, fileCount, isPinned, createdAt,
}: PostCardProps) {
  return (
    <Link to={`/boards/${boardSlug}/posts/${id}`}
      className="block p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">
      <div className="flex items-center gap-2 mb-1">
        {isPinned && (
          <span className="text-xs px-2 py-0.5 bg-[var(--color-gold)]/20 text-[var(--color-gold)] rounded">고정</span>
        )}
        <h3 className="text-white font-medium truncate">{title}</h3>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{user.nickname}</span>
        <span>{new Date(createdAt).toLocaleDateString("ko-KR")}</span>
        <span>조회 {viewCount}</span>
        {commentCount > 0 && <span>댓글 {commentCount}</span>}
        {fileCount > 0 && <span>파일 {fileCount}</span>}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create FileUploader component**

```tsx
// frontend/src/components/board/FileUploader.tsx
import { useRef } from "react";

interface FileUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}

export default function FileUploader({ files, onChange, maxFiles = 10 }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const combined = [...files, ...newFiles].slice(0, maxFiles);
    onChange(combined);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input ref={inputRef} type="file" multiple onChange={handleAdd}
        className="hidden" id="file-upload" />
      <label htmlFor="file-upload"
        className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 cursor-pointer hover:bg-white/10 transition">
        파일 첨부 ({files.length}/{maxFiles})
      </label>
      {files.length > 0 && (
        <ul className="mt-2 space-y-1">
          {files.map((file, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
              <span className="truncate">{file.name}</span>
              <span className="text-gray-600">({(file.size / 1024).toFixed(0)} KB)</span>
              <button onClick={() => handleRemove(i)} className="text-red-400 hover:text-red-300">x</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create FileList component**

```tsx
// frontend/src/components/board/FileList.tsx
interface FileInfo {
  id: number;
  original_name: string;
  file_size: number;
  mime_type: string;
}

export default function FileList({ files }: { files: FileInfo[] }) {
  if (files.length === 0) return null;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
      <h4 className="text-sm text-gray-400 mb-2">첨부파일 ({files.length})</h4>
      <ul className="space-y-1">
        {files.map((file) => (
          <li key={file.id} className="flex items-center gap-2 text-sm">
            <a href={`/api/files/${file.id}/download`}
              className="text-[var(--color-gold)] hover:underline truncate">
              {file.original_name}
            </a>
            <span className="text-gray-600">({formatSize(file.file_size)})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Create ImageGallery component**

```tsx
// frontend/src/components/board/ImageGallery.tsx
interface ImageFile {
  id: number;
  original_name: string;
  mime_type: string;
}

export default function ImageGallery({ files }: { files: ImageFile[] }) {
  const images = files.filter((f) => f.mime_type.startsWith("image/"));
  if (images.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
      {images.map((img) => (
        <a key={img.id} href={`/api/files/${img.id}/download`} target="_blank" rel="noopener noreferrer">
          <img src={`/api/files/${img.id}/download`} alt={img.original_name}
            className="w-full h-48 object-cover rounded-lg border border-white/10" />
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Create CommentItem component**

```tsx
// frontend/src/components/board/CommentItem.tsx
import { useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";

interface Comment {
  id: number;
  post_id: number;
  user: { id: number; nickname: string; profile_image: string | null };
  parent_id: number | null;
  content: string;
  is_adopted: boolean;
  created_at: string;
  replies: Comment[];
}

interface Props {
  comment: Comment;
  postUserId: number;
  boardType: string;
  onReply: (parentId: number, content: string) => Promise<void>;
  onAdopt: (commentId: number) => Promise<void>;
  depth?: number;
}

export default function CommentItem({ comment, postUserId, boardType, onReply, onAdopt, depth = 0 }: Props) {
  const { user } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    await onReply(comment.id, replyContent);
    setReplyContent("");
    setShowReply(false);
  };

  return (
    <div className={`${depth > 0 ? "ml-8 border-l border-white/10 pl-4" : ""}`}>
      <div className={`py-3 ${comment.is_adopted ? "bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 rounded-lg p-3" : ""}`}>
        {comment.is_adopted && (
          <span className="text-xs px-2 py-0.5 bg-[var(--color-gold)]/20 text-[var(--color-gold)] rounded mb-2 inline-block">
            채택된 답변
          </span>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <span className="text-white">{comment.user.nickname}</span>
          <span>{new Date(comment.created_at).toLocaleDateString("ko-KR")}</span>
        </div>
        <p className="text-gray-300 text-sm">{comment.content}</p>
        <div className="flex gap-3 mt-2">
          {user && depth < 2 && (
            <button onClick={() => setShowReply(!showReply)} className="text-xs text-gray-500 hover:text-gray-300">
              답글
            </button>
          )}
          {boardType === "qna" && user?.id === postUserId && !comment.is_adopted && !comment.parent_id && (
            <button onClick={() => onAdopt(comment.id)} className="text-xs text-[var(--color-gold)] hover:underline">
              채택
            </button>
          )}
        </div>
      </div>

      {showReply && (
        <div className="ml-8 mt-2 flex gap-2">
          <input value={replyContent} onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요"
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white" />
          <button onClick={handleReply}
            className="px-3 py-2 bg-[var(--color-gold)] text-black text-sm rounded-lg">등록</button>
        </div>
      )}

      {comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} postUserId={postUserId}
          boardType={boardType} onReply={onReply} onAdopt={onAdopt} depth={depth + 1} />
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Create CommentSection component**

```tsx
// frontend/src/components/board/CommentSection.tsx
import { useState, useEffect } from "react";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";
import CommentItem from "./CommentItem";

interface Comment {
  id: number;
  post_id: number;
  user: { id: number; nickname: string; profile_image: string | null };
  parent_id: number | null;
  content: string;
  is_adopted: boolean;
  created_at: string;
  replies: Comment[];
}

interface Props {
  postId: number;
  postUserId: number;
  boardType: string;
}

export default function CommentSection({ postId, postUserId, boardType }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    const { data } = await api.get(`/posts/${postId}/comments`);
    setComments(data);
  };

  useEffect(() => { fetchComments(); }, [postId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    await api.post(`/posts/${postId}/comments`, { content: newComment });
    setNewComment("");
    fetchComments();
  };

  const handleReply = async (parentId: number, content: string) => {
    await api.post(`/posts/${postId}/comments`, { content, parent_id: parentId });
    fetchComments();
  };

  const handleAdopt = async (commentId: number) => {
    await api.post(`/comments/${commentId}/adopt`);
    fetchComments();
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg text-white mb-4">댓글 ({comments.length})</h3>

      {user && (
        <div className="flex gap-2 mb-6">
          <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white" />
          <button onClick={handleSubmit}
            className="px-6 py-3 bg-[var(--color-gold)] text-black font-semibold rounded-lg">등록</button>
        </div>
      )}

      <div className="space-y-1">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} postUserId={postUserId}
            boardType={boardType} onReply={handleReply} onAdopt={handleAdopt} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Create BoardListPage**

```tsx
// frontend/src/pages/Board/BoardListPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";

interface Board {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  board_type: string;
}

const BOARD_ICONS: Record<string, string> = {
  notice: "📢", suggestion: "💡", image: "🖼️",
  video: "🎬", archive: "📁", qna: "❓",
};

export default function BoardListPage() {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    api.get("/boards").then(({ data }) => setBoards(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="heading-display text-3xl text-gold mb-8">게시판</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boards.map((board) => (
          <Link key={board.id} to={`/boards/${board.slug}`}
            className="glass-card p-6 hover:border-[var(--color-gold)]/30 transition">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{BOARD_ICONS[board.slug] || "📋"}</span>
              <h2 className="text-xl text-white font-semibold">{board.name}</h2>
            </div>
            {board.description && <p className="text-sm text-gray-400">{board.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Create PostListPage**

```tsx
// frontend/src/pages/Board/PostListPage.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";
import PostCard from "@/components/board/PostCard";

interface Post {
  id: number;
  board_id: number;
  title: string;
  youtube_url: string | null;
  is_pinned: boolean;
  view_count: number;
  comment_count: number;
  file_count: number;
  user: { id: number; nickname: string; profile_image: string | null };
  created_at: string;
}

export default function PostListPage() {
  const { boardSlug } = useParams<{ boardSlug: string }>();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [boardName, setBoardName] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchPosts = async (p: number = 1, s: string = "") => {
    const params = new URLSearchParams({ page: String(p), per_page: "20" });
    if (s) params.set("search", s);
    const { data } = await api.get(`/boards/${boardSlug}/posts?${params}`);
    setPosts(data.items);
    setTotalPages(data.pages);
    setPage(data.page);
  };

  useEffect(() => {
    api.get("/boards").then(({ data }) => {
      const board = data.find((b: any) => b.slug === boardSlug);
      if (board) setBoardName(board.name);
    });
    fetchPosts();
  }, [boardSlug]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(1, search);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="heading-display text-3xl text-gold">{boardName}</h1>
        {user && (
          <Link to={`/boards/${boardSlug}/write`}
            className="px-4 py-2 bg-[var(--color-gold)] text-black font-semibold rounded-lg">
            글쓰기
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="검색..."
          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
        <button type="submit" className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm">검색</button>
      </form>

      <div className="space-y-2">
        {posts.map((post) => (
          <PostCard key={post.id} id={post.id} boardSlug={boardSlug!}
            title={post.title} user={post.user} viewCount={post.view_count}
            commentCount={post.comment_count} fileCount={post.file_count}
            isPinned={post.is_pinned} createdAt={post.created_at} />
        ))}
        {posts.length === 0 && (
          <p className="text-center text-gray-500 py-12">게시글이 없습니다.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => fetchPosts(p, search)}
              className={`px-3 py-1 rounded ${p === page ? "bg-[var(--color-gold)] text-black" : "bg-white/5 text-gray-400"}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 9: Create PostDetailPage**

```tsx
// frontend/src/pages/Board/PostDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";
import FileList from "@/components/board/FileList";
import ImageGallery from "@/components/board/ImageGallery";
import CommentSection from "@/components/board/CommentSection";

interface PostDetail {
  id: number;
  board_id: number;
  title: string;
  content: string;
  youtube_url: string | null;
  is_pinned: boolean;
  view_count: number;
  user: { id: number; nickname: string; profile_image: string | null };
  files: { id: number; original_name: string; file_size: number; mime_type: string }[];
  created_at: string;
  updated_at: string;
}

export default function PostDetailPage() {
  const { boardSlug, postId } = useParams<{ boardSlug: string; postId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [boardType, setBoardType] = useState("general");

  useEffect(() => {
    api.get(`/posts/${postId}`).then(({ data }) => setPost(data));
    api.get("/boards").then(({ data }) => {
      const board = data.find((b: any) => b.slug === boardSlug);
      if (board) setBoardType(board.board_type);
    });
  }, [postId, boardSlug]);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await api.delete(`/posts/${postId}`);
    navigate(`/boards/${boardSlug}`);
  };

  if (!post) return <div className="min-h-screen flex items-center justify-center text-gray-400">로딩 중...</div>;

  const isAuthor = user?.id === post.user.id;
  const isAdmin = user && ["admin", "superadmin"].includes(user.role);
  const imageFiles = post.files.filter((f) => f.mime_type.startsWith("image/"));
  const otherFiles = post.files.filter((f) => !f.mime_type.startsWith("image/"));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article>
        <h1 className="text-2xl text-white font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-white/10">
          <span>{post.user.nickname}</span>
          <span>{new Date(post.created_at).toLocaleDateString("ko-KR")}</span>
          <span>조회 {post.view_count}</span>
          {(isAuthor || isAdmin) && (
            <button onClick={handleDelete} className="text-red-400 hover:text-red-300 ml-auto">삭제</button>
          )}
        </div>

        {post.youtube_url && (
          <div className="mb-6 aspect-video">
            <iframe src={post.youtube_url.replace("watch?v=", "embed/")}
              className="w-full h-full rounded-lg" allowFullScreen />
          </div>
        )}

        <div className="text-gray-300 whitespace-pre-wrap mb-6">{post.content}</div>

        {imageFiles.length > 0 && <ImageGallery files={imageFiles} />}
        {otherFiles.length > 0 && <FileList files={otherFiles} />}
      </article>

      <CommentSection postId={post.id} postUserId={post.user.id} boardType={boardType} />
    </div>
  );
}
```

- [ ] **Step 10: Create PostCreatePage**

```tsx
// frontend/src/pages/Board/PostCreatePage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import FileUploader from "@/components/board/FileUploader";

export default function PostCreatePage() {
  const { boardSlug } = useParams<{ boardSlug: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [boardId, setBoardId] = useState<number | null>(null);
  const [boardType, setBoardType] = useState("");
  const [boardName, setBoardName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.get("/boards").then(({ data }) => {
      const board = data.find((b: any) => b.slug === boardSlug);
      if (board) {
        setBoardId(board.id);
        setBoardType(board.board_type);
        setBoardName(board.name);
      }
    });
  }, [boardSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardId) return;
    setError("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("board_id", String(boardId));
    formData.append("title", title);
    formData.append("content", content);
    if (youtubeUrl) formData.append("youtube_url", youtubeUrl);
    files.forEach((f) => formData.append("files", f));

    try {
      const { data } = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/boards/${boardSlug}/posts/${data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || "게시글 작성에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="heading-display text-2xl text-gold mb-8">{boardName} — 글쓰기</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">제목</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-gold)] focus:outline-none"
            required maxLength={200} />
        </div>

        {boardType === "video" && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">YouTube URL</label>
            <input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-gold)] focus:outline-none"
              required />
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-400 mb-1">내용</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-gold)] focus:outline-none resize-y"
            required />
        </div>

        <FileUploader files={files} onChange={setFiles} />

        <button type="submit" disabled={isLoading}
          className="w-full py-3 bg-[var(--color-gold)] text-black font-semibold rounded-lg hover:bg-[var(--color-gold-light)] transition disabled:opacity-50">
          {isLoading ? "등록 중..." : "등록"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 11: Update App.tsx with board routes**

Add these imports and routes to `frontend/src/App.tsx`:

```tsx
import BoardListPage from "@/pages/Board/BoardListPage";
import PostListPage from "@/pages/Board/PostListPage";
import PostDetailPage from "@/pages/Board/PostDetailPage";
import PostCreatePage from "@/pages/Board/PostCreatePage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
```

Add inside the `<Route element={<MainLayout />}>` group:

```tsx
        <Route path="/boards" element={<BoardListPage />} />
        <Route path="/boards/:boardSlug" element={<PostListPage />} />
        <Route path="/boards/:boardSlug/posts/:postId" element={<PostDetailPage />} />
        <Route path="/boards/:boardSlug/write" element={
          <ProtectedRoute><PostCreatePage /></ProtectedRoute>
        } />
```

- [ ] **Step 12: Verify TypeScript compiles**

Run: `cd c:\WORK\IIFF/frontend && npx tsc --noEmit -p tsconfig.app.json`
Expected: No errors.

- [ ] **Step 13: Commit**

```bash
cd c:\WORK\IIFF && git add frontend/ && git commit -m "feat(frontend): add board pages (list, detail, create) with comment system and file upload"
```

---

## Task 8: Full Integration Test

**Files:** None (verification only)

- [ ] **Step 1: Run all backend tests**

```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/ -v
```
Expected: All tests pass.

- [ ] **Step 2: Frontend build check**

```bash
cd c:\WORK\IIFF/frontend && npm run build
```
Expected: Build succeeds.

- [ ] **Step 3: Final commit**

```bash
cd c:\WORK\IIFF && git add -A && git commit -m "feat: complete Phase 3 — board system with 6 board types, comments, and file upload"
```

---

## Summary

After Phase 3 completion:
- Board, Post, Comment, File SQLAlchemy models with Alembic migration
- 6 default boards seeded (notice, suggestion, image, video, archive, qna)
- LocalStorage file upload service with validation (10MB image, 50MB document, max 10 files)
- Board listing endpoint
- Post CRUD (create with multipart file upload, list with pagination/search, detail with view count, update, delete)
- Comment CRUD with nested replies (parent_id)
- Q&A adopt feature (only question author can adopt, only on qna board)
- File download endpoint
- Notice board admin-only write restriction
- Frontend: BoardListPage, PostListPage, PostDetailPage, PostCreatePage
- Frontend: PostCard, CommentSection, CommentItem, FileUploader, FileList, ImageGallery components

**Next:** Phase 4 — Meeting System (Jitsi video + WebSocket text chat)
