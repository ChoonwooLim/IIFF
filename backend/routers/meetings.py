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
