# Phase 4: Meeting System — Jitsi Video + WebSocket Text Chat

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Video meeting rooms (Jitsi iframe embed) and text chat rooms (FastAPI WebSocket) with participant tracking and message persistence.

**Architecture:** Meeting/MeetingParticipant/ChatMessage 3개 모델. Video rooms use Jitsi public server iframe. Text rooms use FastAPI WebSocket with in-memory connection manager + DB persistence. Frontend React pages for room list, video room, text chat room.

**Tech Stack:** FastAPI, SQLAlchemy 2.0, Alembic, FastAPI WebSocket, Jitsi Meet (public), React, TypeScript

---

## File Structure

### Backend — New/Modified Files

```
backend/
├── models/
│   ├── __init__.py              # (modify) import Meeting, MeetingParticipant, ChatMessage
│   ├── meeting.py               # Meeting model
│   ├── meeting_participant.py   # MeetingParticipant model
│   └── chat_message.py          # ChatMessage model
├── routers/
│   ├── meetings.py              # Meeting CRUD + participant tracking
│   └── chat.py                  # WebSocket chat handler
├── schemas/
│   └── meeting.py               # Meeting request/response schemas
├── services/
│   └── connection_manager.py    # WebSocket connection manager
├── config.py                    # (modify) add jitsi_domain
├── main.py                      # (modify) mount meeting + chat routers
└── tests/
    ├── test_meeting_model.py
    ├── test_meeting_crud.py
    └── test_chat_websocket.py
```

### Frontend — New Files

```
frontend/src/
├── pages/
│   └── Meeting/
│       ├── MeetingListPage.tsx      # 미팅룸 목록
│       ├── VideoRoomPage.tsx        # Jitsi 비디오 룸
│       └── TextChatPage.tsx         # WebSocket 텍스트 채팅
├── components/
│   └── meeting/
│       ├── MeetingCard.tsx          # 미팅룸 카드
│       ├── ChatMessage.tsx          # 채팅 메시지
│       └── ParticipantList.tsx      # 참여자 목록
└── App.tsx                          # (modify) add meeting routes
```

---

## Task 1: Meeting + MeetingParticipant + ChatMessage Models + Migration

**Files:**
- Create: `backend/models/meeting.py`
- Create: `backend/models/meeting_participant.py`
- Create: `backend/models/chat_message.py`
- Modify: `backend/models/__init__.py`
- Create: Alembic migration
- Create: `backend/tests/test_meeting_model.py`

- [ ] **Step 1: Create Meeting model**

```python
# backend/models/meeting.py
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
```

- [ ] **Step 2: Create MeetingParticipant model**

```python
# backend/models/meeting_participant.py
from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


class MeetingParticipant(Base):
    __tablename__ = "meeting_participants"

    id: Mapped[int] = mapped_column(primary_key=True)
    meeting_id: Mapped[int] = mapped_column(ForeignKey("meetings.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    joined_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    left_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    meeting: Mapped["Meeting"] = relationship(back_populates="participants")
    user: Mapped["User"] = relationship()
```

- [ ] **Step 3: Create ChatMessage model**

```python
# backend/models/chat_message.py
from datetime import datetime
from sqlalchemy import Text, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    meeting_id: Mapped[int] = mapped_column(ForeignKey("meetings.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    meeting: Mapped["Meeting"] = relationship(back_populates="messages")
    user: Mapped["User"] = relationship()
```

- [ ] **Step 4: Update models/__init__.py**

```python
# backend/models/__init__.py
from database import Base
from models.user import User
from models.board import Board
from models.post import Post
from models.comment import Comment
from models.file import File
from models.meeting import Meeting
from models.meeting_participant import MeetingParticipant
from models.chat_message import ChatMessage

__all__ = ["Base", "User", "Board", "Post", "Comment", "File", "Meeting", "MeetingParticipant", "ChatMessage"]
```

- [ ] **Step 5: Write model tests**

```python
# backend/tests/test_meeting_model.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from models.meeting import Meeting
from models.meeting_participant import MeetingParticipant
from models.chat_message import ChatMessage
from models.user import User

engine_test = create_engine("sqlite:///./test_meeting.db", connect_args={"check_same_thread": False})
TestSession = sessionmaker(bind=engine_test)

@pytest.fixture(scope="module", autouse=True)
def setup():
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)
    import os
    engine_test.dispose()
    os.remove("./test_meeting.db") if os.path.exists("./test_meeting.db") else None

@pytest.fixture()
def db():
    session = TestSession()
    yield session
    session.rollback()
    session.close()

def test_create_video_meeting(db):
    user = User(auth_provider="local", username="meethost", password_hash="hash",
        email="meethost@test.com", name="호스트", nickname="호스트", phone="010-0000-0000")
    db.add(user)
    db.commit()
    meeting = Meeting(name="테스트 회의", type="video", created_by=user.id, jitsi_room_id="iiff-test-room-123")
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    assert meeting.id is not None
    assert meeting.status == "active"
    assert meeting.max_participants == 10

def test_create_text_meeting(db):
    user = User(auth_provider="local", username="texthost", password_hash="hash",
        email="texthost@test.com", name="텍스트호스트", nickname="텍호", phone="010-1111-1111")
    db.add(user)
    db.commit()
    meeting = Meeting(name="텍스트 채팅", type="text", created_by=user.id)
    db.add(meeting)
    db.commit()
    assert meeting.jitsi_room_id is None

def test_add_participant(db):
    user = User(auth_provider="local", username="participant", password_hash="hash",
        email="part@test.com", name="참여자", nickname="참여자", phone="010-2222-2222")
    db.add(user)
    db.commit()
    meeting = Meeting(name="참여 테스트", type="text", created_by=user.id)
    db.add(meeting)
    db.commit()
    participant = MeetingParticipant(meeting_id=meeting.id, user_id=user.id)
    db.add(participant)
    db.commit()
    db.refresh(participant)
    assert participant.left_at is None

def test_create_chat_message(db):
    user = User(auth_provider="local", username="chatter", password_hash="hash",
        email="chat@test.com", name="채터", nickname="채터", phone="010-3333-3333")
    db.add(user)
    db.commit()
    meeting = Meeting(name="채팅 테스트", type="text", created_by=user.id)
    db.add(meeting)
    db.commit()
    msg = ChatMessage(meeting_id=meeting.id, user_id=user.id, content="안녕하세요!")
    db.add(msg)
    db.commit()
    db.refresh(msg)
    assert msg.content == "안녕하세요!"
```

- [ ] **Step 6: Run tests**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/test_meeting_model.py -v`
Expected: 4 passed.

- [ ] **Step 7: Generate and apply Alembic migration**

```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m alembic revision --autogenerate -m "create meetings, meeting_participants, chat_messages tables"
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m alembic upgrade head
```

- [ ] **Step 8: Commit**

```bash
cd c:\WORK\IIFF && git add backend/models/ backend/tests/test_meeting_model.py backend/alembic/ && git commit -m "feat(backend): add Meeting, MeetingParticipant, ChatMessage models with migration"
```

---

## Task 2: Meeting Schemas + Config Update

**Files:**
- Create: `backend/schemas/meeting.py`
- Modify: `backend/config.py`

- [ ] **Step 1: Create meeting schemas**

```python
# backend/schemas/meeting.py
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
```

- [ ] **Step 2: Update config.py**

Add to Settings class:
```python
    jitsi_domain: str = "meet.jit.si"
```

- [ ] **Step 3: Commit**

```bash
cd c:\WORK\IIFF && git add backend/schemas/meeting.py backend/config.py && git commit -m "feat(backend): add meeting schemas and Jitsi config"
```

---

## Task 3: Meetings Router (CRUD + Participant Tracking)

**Files:**
- Create: `backend/routers/meetings.py`
- Modify: `backend/main.py`
- Create: `backend/tests/test_meeting_crud.py`

- [ ] **Step 1: Create meetings router**

```python
# backend/routers/meetings.py
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from config import settings
from deps import get_db, require_active, require_admin
from models.meeting import Meeting
from models.meeting_participant import MeetingParticipant
from models.chat_message import ChatMessage
from models.user import User
from schemas.meeting import (
    MeetingCreateRequest,
    MeetingResponse,
    MeetingDetailResponse,
    MeetingUserResponse,
    ParticipantResponse,
    ChatMessageResponse,
)

router = APIRouter(prefix="/api/meetings", tags=["meetings"])


@router.get("", response_model=list[MeetingResponse])
def list_meetings(status_filter: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Meeting).options(joinedload(Meeting.creator), joinedload(Meeting.participants))

    if status_filter:
        query = query.filter(Meeting.status == status_filter)
    else:
        query = query.filter(Meeting.status == "active")

    meetings = query.order_by(Meeting.created_at.desc()).all()

    result = []
    for m in meetings:
        active_count = len([p for p in m.participants if p.left_at is None])
        result.append(MeetingResponse(
            id=m.id,
            name=m.name,
            type=m.type,
            status=m.status,
            max_participants=m.max_participants,
            jitsi_room_id=m.jitsi_room_id,
            creator=MeetingUserResponse.model_validate(m.creator),
            participant_count=active_count,
            created_at=m.created_at,
            closed_at=m.closed_at,
        ))
    return result


@router.post("", status_code=status.HTTP_201_CREATED)
def create_meeting(
    req: MeetingCreateRequest,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    jitsi_room_id = None
    if req.type == "video":
        jitsi_room_id = f"iiff-{uuid.uuid4().hex[:12]}"

    meeting = Meeting(
        name=req.name,
        type=req.type,
        created_by=current_user.id,
        max_participants=req.max_participants,
        jitsi_room_id=jitsi_room_id,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)

    return {
        "id": meeting.id,
        "name": meeting.name,
        "type": meeting.type,
        "jitsi_room_id": meeting.jitsi_room_id,
        "message": "회의실이 생성되었습니다",
    }


@router.get("/{meeting_id}", response_model=MeetingDetailResponse)
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = (
        db.query(Meeting)
        .options(
            joinedload(Meeting.creator),
            joinedload(Meeting.participants).joinedload(MeetingParticipant.user),
        )
        .filter(Meeting.id == meeting_id)
        .first()
    )
    if not meeting:
        raise HTTPException(status_code=404, detail="회의실을 찾을 수 없습니다")
    return meeting


@router.post("/{meeting_id}/join")
def join_meeting(
    meeting_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id, Meeting.status == "active").first()
    if not meeting:
        raise HTTPException(status_code=404, detail="활성화된 회의실을 찾을 수 없습니다")

    active_count = db.query(MeetingParticipant).filter(
        MeetingParticipant.meeting_id == meeting_id,
        MeetingParticipant.left_at == None,
    ).count()

    if active_count >= meeting.max_participants:
        raise HTTPException(status_code=400, detail="회의실이 가득 찼습니다")

    # Check if already joined
    existing = db.query(MeetingParticipant).filter(
        MeetingParticipant.meeting_id == meeting_id,
        MeetingParticipant.user_id == current_user.id,
        MeetingParticipant.left_at == None,
    ).first()

    if existing:
        return {"message": "이미 참여 중입니다"}

    participant = MeetingParticipant(meeting_id=meeting_id, user_id=current_user.id)
    db.add(participant)
    db.commit()

    return {"message": "회의에 참여했습니다"}


@router.post("/{meeting_id}/leave")
def leave_meeting(
    meeting_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    participant = db.query(MeetingParticipant).filter(
        MeetingParticipant.meeting_id == meeting_id,
        MeetingParticipant.user_id == current_user.id,
        MeetingParticipant.left_at == None,
    ).first()

    if not participant:
        raise HTTPException(status_code=404, detail="참여 기록을 찾을 수 없습니다")

    participant.left_at = datetime.now(timezone.utc)
    db.commit()

    return {"message": "회의에서 나갔습니다"}


@router.post("/{meeting_id}/close")
def close_meeting(
    meeting_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="회의실을 찾을 수 없습니다")

    if meeting.created_by != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="종료 권한이 없습니다")

    meeting.status = "closed"
    meeting.closed_at = datetime.now(timezone.utc)

    # Mark all active participants as left
    db.query(MeetingParticipant).filter(
        MeetingParticipant.meeting_id == meeting_id,
        MeetingParticipant.left_at == None,
    ).update({"left_at": datetime.now(timezone.utc)})

    db.commit()
    return {"message": "회의가 종료되었습니다"}


@router.get("/{meeting_id}/messages", response_model=list[ChatMessageResponse])
def get_messages(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="회의실을 찾을 수 없습니다")

    messages = (
        db.query(ChatMessage)
        .options(joinedload(ChatMessage.user))
        .filter(ChatMessage.meeting_id == meeting_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )
    return messages
```

- [ ] **Step 2: Mount in main.py**

Add:
```python
from routers.meetings import router as meetings_router
app.include_router(meetings_router)
```

- [ ] **Step 3: Write meeting CRUD tests**

```python
# backend/tests/test_meeting_crud.py

def _register_and_activate(client, username, email, nickname):
    client.post("/api/auth/register", json={
        "username": username, "password": "Pass1234!",
        "email": email, "name": "테스트유저",
        "nickname": nickname, "phone": "010-0000-0000",
    })
    from tests.conftest import override_activate_user
    override_activate_user(client, username)
    resp = client.post("/api/auth/login", json={"username": username, "password": "Pass1234!"})
    return resp.json()["access_token"]


def test_create_video_meeting(client):
    token = _register_and_activate(client, "meethost1", "meethost1@test.com", "미팅호스트1")
    response = client.post("/api/meetings",
        json={"name": "테스트 화상회의", "type": "video"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["type"] == "video"
    assert data["jitsi_room_id"] is not None
    assert data["jitsi_room_id"].startswith("iiff-")


def test_create_text_meeting(client):
    token = _register_and_activate(client, "meethost2", "meethost2@test.com", "미팅호스트2")
    response = client.post("/api/meetings",
        json={"name": "텍스트 채팅방", "type": "text"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    assert response.json()["jitsi_room_id"] is None


def test_list_meetings(client):
    response = client.get("/api/meetings")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_join_and_leave_meeting(client):
    token = _register_and_activate(client, "joiner1", "joiner1@test.com", "참여자1")
    # Create meeting
    create_resp = client.post("/api/meetings",
        json={"name": "참여 테스트", "type": "text"},
        headers={"Authorization": f"Bearer {token}"},
    )
    meeting_id = create_resp.json()["id"]

    # Join
    join_resp = client.post(f"/api/meetings/{meeting_id}/join",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert join_resp.status_code == 200

    # Leave
    leave_resp = client.post(f"/api/meetings/{meeting_id}/leave",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert leave_resp.status_code == 200


def test_close_meeting(client):
    token = _register_and_activate(client, "closer1", "closer1@test.com", "종료자1")
    create_resp = client.post("/api/meetings",
        json={"name": "종료 테스트", "type": "text"},
        headers={"Authorization": f"Bearer {token}"},
    )
    meeting_id = create_resp.json()["id"]

    close_resp = client.post(f"/api/meetings/{meeting_id}/close",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert close_resp.status_code == 200


def test_get_meeting_detail(client):
    token = _register_and_activate(client, "detailuser", "detail@test.com", "디테일유저")
    create_resp = client.post("/api/meetings",
        json={"name": "상세 테스트", "type": "video"},
        headers={"Authorization": f"Bearer {token}"},
    )
    meeting_id = create_resp.json()["id"]

    response = client.get(f"/api/meetings/{meeting_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "상세 테스트"
```

- [ ] **Step 4: Run tests**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/test_meeting_crud.py -v`
Expected: 6 passed.

- [ ] **Step 5: Commit**

```bash
cd c:\WORK\IIFF && git add backend/ && git commit -m "feat(backend): add meetings router with CRUD, join/leave, and close endpoints"
```

---

## Task 4: WebSocket Chat Handler

**Files:**
- Create: `backend/services/connection_manager.py`
- Create: `backend/routers/chat.py`
- Modify: `backend/main.py`
- Create: `backend/tests/test_chat_websocket.py`

- [ ] **Step 1: Create connection manager**

```python
# backend/services/connection_manager.py
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        # meeting_id -> list of (websocket, user_info) tuples
        self.active_connections: dict[int, list[tuple[WebSocket, dict]]] = {}

    async def connect(self, websocket: WebSocket, meeting_id: int, user_info: dict):
        await websocket.accept()
        if meeting_id not in self.active_connections:
            self.active_connections[meeting_id] = []
        self.active_connections[meeting_id].append((websocket, user_info))

    def disconnect(self, websocket: WebSocket, meeting_id: int):
        if meeting_id in self.active_connections:
            self.active_connections[meeting_id] = [
                (ws, info) for ws, info in self.active_connections[meeting_id]
                if ws != websocket
            ]
            if not self.active_connections[meeting_id]:
                del self.active_connections[meeting_id]

    async def broadcast(self, meeting_id: int, message: dict):
        if meeting_id in self.active_connections:
            disconnected = []
            for ws, _ in self.active_connections[meeting_id]:
                try:
                    await ws.send_json(message)
                except Exception:
                    disconnected.append(ws)
            for ws in disconnected:
                self.disconnect(ws, meeting_id)

    def get_participants(self, meeting_id: int) -> list[dict]:
        if meeting_id not in self.active_connections:
            return []
        return [info for _, info in self.active_connections[meeting_id]]


manager = ConnectionManager()
```

- [ ] **Step 2: Create chat WebSocket router**

```python
# backend/routers/chat.py
from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models.chat_message import ChatMessage
from models.meeting import Meeting
from models.user import User
from services.auth_service import decode_token
from services.connection_manager import manager

router = APIRouter()


def get_user_from_token(token: str, db: Session) -> User | None:
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        return None
    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    return user


@router.websocket("/ws/meetings/{meeting_id}")
async def websocket_chat(websocket: WebSocket, meeting_id: int):
    # Get token from query params
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4001, reason="Token required")
        return

    db = SessionLocal()
    try:
        user = get_user_from_token(token, db)
        if not user or user.status != "active":
            await websocket.close(code=4003, reason="Unauthorized")
            return

        meeting = db.query(Meeting).filter(
            Meeting.id == meeting_id, Meeting.status == "active"
        ).first()
        if not meeting:
            await websocket.close(code=4004, reason="Meeting not found")
            return

        if meeting.type != "text":
            await websocket.close(code=4005, reason="Not a text meeting")
            return

        user_info = {"id": user.id, "nickname": user.nickname, "profile_image": user.profile_image}

        await manager.connect(websocket, meeting_id, user_info)

        # Broadcast join
        await manager.broadcast(meeting_id, {
            "type": "user_joined",
            "user": user_info,
        })

        # Send participant list
        await websocket.send_json({
            "type": "participants",
            "users": manager.get_participants(meeting_id),
        })

        try:
            while True:
                data = await websocket.receive_json()

                if data.get("type") == "message" and data.get("content"):
                    content = data["content"].strip()
                    if content:
                        # Save to DB
                        msg = ChatMessage(
                            meeting_id=meeting_id,
                            user_id=user.id,
                            content=content,
                        )
                        db.add(msg)
                        db.commit()

                        # Broadcast
                        await manager.broadcast(meeting_id, {
                            "type": "new_message",
                            "user": user_info,
                            "content": content,
                            "timestamp": datetime.now(timezone.utc).isoformat(),
                        })

        except WebSocketDisconnect:
            pass
        finally:
            manager.disconnect(websocket, meeting_id)
            await manager.broadcast(meeting_id, {
                "type": "user_left",
                "user": user_info,
            })
    finally:
        db.close()
```

- [ ] **Step 3: Mount chat router in main.py**

Add:
```python
from routers.chat import router as chat_router
app.include_router(chat_router)
```

- [ ] **Step 4: Write WebSocket test**

```python
# backend/tests/test_chat_websocket.py
import pytest
from fastapi.testclient import TestClient


def _register_and_activate(client, username, email, nickname):
    client.post("/api/auth/register", json={
        "username": username, "password": "Pass1234!",
        "email": email, "name": "테스트유저",
        "nickname": nickname, "phone": "010-0000-0000",
    })
    from tests.conftest import override_activate_user
    override_activate_user(client, username)
    resp = client.post("/api/auth/login", json={"username": username, "password": "Pass1234!"})
    return resp.json()["access_token"]


def _ensure_text_meeting(client, token):
    from models.meeting import Meeting
    from deps import get_db
    from main import app
    db = next(app.dependency_overrides[get_db]())
    meeting = Meeting(name="WebSocket Test", type="text", created_by=1)
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting.id


def test_websocket_connect_without_token(client):
    from main import app
    with TestClient(app) as tc:
        with pytest.raises(Exception):
            with tc.websocket_connect("/ws/meetings/1"):
                pass


def test_websocket_requires_active_user(client):
    # Register but don't activate
    client.post("/api/auth/register", json={
        "username": "wsuser_inactive", "password": "Pass1234!",
        "email": "wsinactive@test.com", "name": "비활성",
        "nickname": "비활성유저", "phone": "010-9999-9999",
    })
    # Can't login because pending, so test with invalid token
    from main import app
    with TestClient(app) as tc:
        with pytest.raises(Exception):
            with tc.websocket_connect("/ws/meetings/1?token=invalid"):
                pass
```

- [ ] **Step 5: Run tests**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/test_chat_websocket.py -v`

- [ ] **Step 6: Run all tests**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/ -v`

- [ ] **Step 7: Commit**

```bash
cd c:\WORK\IIFF && git add backend/ && git commit -m "feat(backend): add WebSocket chat handler with connection manager and message persistence"
```

---

## Task 5: Frontend — Meeting Pages

**Files:**
- Create: `frontend/src/components/meeting/MeetingCard.tsx`
- Create: `frontend/src/components/meeting/ChatMessage.tsx`
- Create: `frontend/src/components/meeting/ParticipantList.tsx`
- Create: `frontend/src/pages/Meeting/MeetingListPage.tsx`
- Create: `frontend/src/pages/Meeting/VideoRoomPage.tsx`
- Create: `frontend/src/pages/Meeting/TextChatPage.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Create MeetingCard**

```tsx
// frontend/src/components/meeting/MeetingCard.tsx
import { Link } from "react-router-dom";

interface MeetingCardProps {
  id: number;
  name: string;
  type: "video" | "text";
  participantCount: number;
  maxParticipants: number;
  creator: { nickname: string };
  createdAt: string;
}

export default function MeetingCard({ id, name, type, participantCount, maxParticipants, creator, createdAt }: MeetingCardProps) {
  const icon = type === "video" ? "🎥" : "💬";
  const path = type === "video" ? `/meetings/video/${id}` : `/meetings/chat/${id}`;

  return (
    <Link to={path} className="glass-card p-5 hover:border-[var(--color-gold)]/30 transition block">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-white font-semibold truncate">{name}</h3>
        <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-gray-400 ml-auto">
          {type === "video" ? "화상" : "텍스트"}
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{creator.nickname}</span>
        <span>{participantCount}/{maxParticipants}명</span>
        <span>{new Date(createdAt).toLocaleDateString("ko-KR")}</span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create ChatMessage component**

```tsx
// frontend/src/components/meeting/ChatMessage.tsx
interface Props {
  user: { id: number; nickname: string };
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export default function ChatMessage({ user, content, timestamp, isOwn }: Props) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`max-w-[70%] ${isOwn ? "bg-[var(--color-gold)]/20" : "bg-white/10"} rounded-lg px-4 py-2`}>
        {!isOwn && <p className="text-xs text-[var(--color-gold)] mb-1">{user.nickname}</p>}
        <p className="text-sm text-gray-200">{content}</p>
        <p className="text-[10px] text-gray-600 mt-1">{new Date(timestamp).toLocaleTimeString("ko-KR")}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create ParticipantList**

```tsx
// frontend/src/components/meeting/ParticipantList.tsx
interface Participant {
  id: number;
  nickname: string;
  profile_image: string | null;
}

export default function ParticipantList({ participants }: { participants: Participant[] }) {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
      <h4 className="text-sm text-gray-400 mb-3">참여자 ({participants.length})</h4>
      <ul className="space-y-2">
        {participants.map((p) => (
          <li key={p.id} className="flex items-center gap-2 text-sm text-gray-300">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            {p.nickname}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Create MeetingListPage**

```tsx
// frontend/src/pages/Meeting/MeetingListPage.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";
import api from "@/services/api";
import MeetingCard from "@/components/meeting/MeetingCard";

interface Meeting {
  id: number;
  name: string;
  type: "video" | "text";
  status: string;
  max_participants: number;
  participant_count: number;
  creator: { id: number; nickname: string; profile_image: string | null };
  created_at: string;
}

export default function MeetingListPage() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"video" | "text">("text");

  const fetchMeetings = () => {
    api.get("/meetings").then(({ data }) => setMeetings(data));
  };

  useEffect(() => { fetchMeetings(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/meetings", { name, type });
    setName("");
    setShowCreate(false);
    fetchMeetings();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="heading-display text-3xl text-gold">회의실</h1>
        {user && (
          <button onClick={() => setShowCreate(!showCreate)}
            className="px-4 py-2 bg-[var(--color-gold)] text-black font-semibold rounded-lg">
            회의실 만들기
          </button>
        )}
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="glass-card p-6 mb-6 space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="회의실 이름"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white" required />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input type="radio" name="type" checked={type === "text"} onChange={() => setType("text")} />
              💬 텍스트 채팅
            </label>
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input type="radio" name="type" checked={type === "video"} onChange={() => setType("video")} />
              🎥 화상 회의
            </label>
          </div>
          <button type="submit" className="px-6 py-2 bg-[var(--color-gold)] text-black font-semibold rounded-lg">생성</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meetings.map((m) => (
          <MeetingCard key={m.id} id={m.id} name={m.name} type={m.type}
            participantCount={m.participant_count} maxParticipants={m.max_participants}
            creator={m.creator} createdAt={m.created_at} />
        ))}
        {meetings.length === 0 && (
          <p className="text-gray-500 col-span-2 text-center py-12">활성화된 회의실이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create VideoRoomPage**

```tsx
// frontend/src/pages/Meeting/VideoRoomPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";

interface MeetingDetail {
  id: number;
  name: string;
  jitsi_room_id: string;
  status: string;
  creator: { id: number; nickname: string };
}

export default function VideoRoomPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);

  useEffect(() => {
    api.get(`/meetings/${meetingId}`).then(({ data }) => setMeeting(data));
    api.post(`/meetings/${meetingId}/join`).catch(() => {});
    return () => { api.post(`/meetings/${meetingId}/leave`).catch(() => {}); };
  }, [meetingId]);

  const handleClose = async () => {
    await api.post(`/meetings/${meetingId}/close`);
    navigate("/meetings");
  };

  if (!meeting) return <div className="min-h-screen flex items-center justify-center text-gray-400">로딩 중...</div>;

  const jitsiUrl = `https://meet.jit.si/${meeting.jitsi_room_id}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl text-white font-bold">{meeting.name}</h1>
        <div className="flex gap-2">
          {(user?.id === meeting.creator.id || ["admin", "superadmin"].includes(user?.role || "")) && (
            <button onClick={handleClose} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm">
              회의 종료
            </button>
          )}
          <button onClick={() => navigate("/meetings")} className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg text-sm">
            나가기
          </button>
        </div>
      </div>
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <iframe src={jitsiUrl} className="w-full h-full" allow="camera; microphone; display-capture" allowFullScreen />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create TextChatPage**

```tsx
// frontend/src/pages/Meeting/TextChatPage.tsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";
import ChatMessageComponent from "@/components/meeting/ChatMessage";
import ParticipantList from "@/components/meeting/ParticipantList";

interface Message {
  type: string;
  user?: { id: number; nickname: string };
  content?: string;
  timestamp?: string;
  users?: { id: number; nickname: string; profile_image: string | null }[];
}

export default function TextChatPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{ user: { id: number; nickname: string }; content: string; timestamp: string }[]>([]);
  const [participants, setParticipants] = useState<{ id: number; nickname: string; profile_image: string | null }[]>([]);
  const [input, setInput] = useState("");
  const [meetingName, setMeetingName] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load meeting info and history
    api.get(`/meetings/${meetingId}`).then(({ data }) => setMeetingName(data.name));
    api.get(`/meetings/${meetingId}/messages`).then(({ data }) => {
      setMessages(data.map((m: any) => ({
        user: m.user,
        content: m.content,
        timestamp: m.created_at,
      })));
    });

    // Connect WebSocket
    const token = localStorage.getItem("access_token");
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${wsProtocol}//${window.location.host}/ws/meetings/${meetingId}?token=${token}`);

    ws.onmessage = (event) => {
      const data: Message = JSON.parse(event.data);
      if (data.type === "new_message" && data.user && data.content) {
        setMessages((prev) => [...prev, {
          user: data.user!,
          content: data.content!,
          timestamp: data.timestamp || new Date().toISOString(),
        }]);
      } else if (data.type === "participants" && data.users) {
        setParticipants(data.users);
      } else if (data.type === "user_joined" || data.type === "user_left") {
        // Refresh participant list
        api.get(`/meetings/${meetingId}`).then(({ resp }: any) => {});
      }
    };

    wsRef.current = ws;

    return () => {
      ws.close();
      api.post(`/meetings/${meetingId}/leave`).catch(() => {});
    };
  }, [meetingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: "message", content: input }));
    setInput("");
  };

  const handleClose = async () => {
    await api.post(`/meetings/${meetingId}/close`);
    navigate("/meetings");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex gap-4 h-[calc(100vh-120px)]">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl text-white font-bold">{meetingName}</h1>
          <div className="flex gap-2">
            <button onClick={handleClose} className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm">종료</button>
            <button onClick={() => navigate("/meetings")} className="px-3 py-1.5 bg-white/10 text-gray-300 rounded-lg text-sm">나가기</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
          {messages.map((msg, i) => (
            <ChatMessageComponent key={i} user={msg.user} content={msg.content}
              timestamp={msg.timestamp} isOwn={msg.user.id === user?.id} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white" />
          <button onClick={handleSend}
            className="px-6 py-3 bg-[var(--color-gold)] text-black font-semibold rounded-lg">전송</button>
        </div>
      </div>

      <div className="w-64 hidden lg:block">
        <ParticipantList participants={participants} />
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Update App.tsx**

Add imports and routes inside `<Route element={<MainLayout />}>`:
```tsx
import MeetingListPage from "@/pages/Meeting/MeetingListPage";
import VideoRoomPage from "@/pages/Meeting/VideoRoomPage";
import TextChatPage from "@/pages/Meeting/TextChatPage";

// Inside MainLayout routes:
<Route path="/meetings" element={<MeetingListPage />} />
<Route path="/meetings/video/:meetingId" element={
  <ProtectedRoute><VideoRoomPage /></ProtectedRoute>
} />
<Route path="/meetings/chat/:meetingId" element={
  <ProtectedRoute><TextChatPage /></ProtectedRoute>
} />
```

- [ ] **Step 8: Verify TypeScript**

Run: `cd c:\WORK\IIFF/frontend && npx tsc --noEmit -p tsconfig.app.json`

- [ ] **Step 9: Commit**

```bash
cd c:\WORK\IIFF && git add frontend/ && git commit -m "feat(frontend): add meeting pages (list, video room, text chat) with WebSocket integration"
```

---

## Task 6: Full Integration Test

- [ ] **Step 1: Run all backend tests**

```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/ -v
```

- [ ] **Step 2: Frontend build**

```bash
cd c:\WORK\IIFF/frontend && npm run build
```

- [ ] **Step 3: Final commit (if needed)**

```bash
cd c:\WORK\IIFF && git add -A && git commit -m "feat: complete Phase 4 — meeting system with Jitsi video and WebSocket text chat"
```

---

## Summary

After Phase 4 completion:
- Meeting, MeetingParticipant, ChatMessage models with Alembic migration
- Meeting CRUD: create (video/text), list active, get detail, join, leave, close
- Video meetings: Jitsi iframe embed with auto-generated room IDs
- Text chat: WebSocket handler with connection manager, message broadcast, DB persistence
- Frontend: MeetingListPage with create form, VideoRoomPage with Jitsi iframe, TextChatPage with WebSocket chat
- Participant tracking (join/leave timestamps)
- Chat message history loading on room entry

**Next:** Phase 5 — Admin Dashboard (user management, post moderation, site settings)
