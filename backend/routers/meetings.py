import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from config import settings
from deps import get_db, require_active, require_admin
from models.meeting import Meeting
from models.meeting_participant import MeetingParticipant
from models.meeting_invitation import MeetingInvitation
from models.chat_message import ChatMessage
from models.user import User
from schemas.meeting import (
    MeetingCreateRequest,
    MeetingUpdateRequest,
    MeetingInviteRequest,
    MeetingResponse,
    MeetingDetailResponse,
    MeetingUserResponse,
    MeetingInvitationResponse,
    ParticipantResponse,
    ChatMessageResponse,
)

router = APIRouter(prefix="/api/meetings", tags=["meetings"])


# --- User search for invitations ---

@router.get("/users/search")
def search_users(q: str, db: Session = Depends(get_db), current_user: User = Depends(require_active)):
    if len(q.strip()) < 1:
        return []
    users = (
        db.query(User)
        .filter(
            User.status == "active",
            User.id != current_user.id,
            (User.nickname.ilike(f"%{q}%") | User.name.ilike(f"%{q}%")),
        )
        .limit(10)
        .all()
    )
    return [{"id": u.id, "nickname": u.nickname, "name": u.name, "profile_image": u.profile_image} for u in users]


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


@router.patch("/{meeting_id}")
def update_meeting(
    meeting_id: int,
    req: MeetingUpdateRequest,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="회의실을 찾을 수 없습니다")

    if meeting.created_by != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="수정 권한이 없습니다")

    meeting.name = req.name
    db.commit()
    return {"message": "회의실 이름이 수정되었습니다"}


@router.delete("/{meeting_id}", status_code=status.HTTP_200_OK)
def delete_meeting(
    meeting_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="회의실을 찾을 수 없습니다")

    if meeting.created_by != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="삭제 권한이 없습니다")

    db.delete(meeting)
    db.commit()
    return {"message": "회의실이 삭제되었습니다"}


# --- Invitation endpoints ---

@router.get("/{meeting_id}/invitations", response_model=list[MeetingInvitationResponse])
def list_invitations(
    meeting_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="회의실을 찾을 수 없습니다")

    invitations = (
        db.query(MeetingInvitation)
        .options(joinedload(MeetingInvitation.user))
        .filter(MeetingInvitation.meeting_id == meeting_id)
        .order_by(MeetingInvitation.invited_at.desc())
        .all()
    )
    return invitations


@router.post("/{meeting_id}/invite", status_code=status.HTTP_201_CREATED)
def invite_user(
    meeting_id: int,
    req: MeetingInviteRequest,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="회의실을 찾을 수 없습니다")

    if meeting.created_by != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="초대 권한이 없습니다")

    target = db.query(User).filter(User.id == req.user_id, User.status == "active").first()
    if not target:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다")

    existing = db.query(MeetingInvitation).filter(
        MeetingInvitation.meeting_id == meeting_id,
        MeetingInvitation.user_id == req.user_id,
    ).first()
    if existing:
        return {"message": "이미 초대된 사용자입니다"}

    invitation = MeetingInvitation(
        meeting_id=meeting_id,
        user_id=req.user_id,
        invited_by=current_user.id,
    )
    db.add(invitation)
    db.commit()
    return {"message": f"{target.nickname}님을 초대했습니다"}


@router.delete("/{meeting_id}/invite/{user_id}")
def remove_invitation(
    meeting_id: int,
    user_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="회의실을 찾을 수 없습니다")

    if meeting.created_by != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="초대 취소 권한이 없습니다")

    invitation = db.query(MeetingInvitation).filter(
        MeetingInvitation.meeting_id == meeting_id,
        MeetingInvitation.user_id == user_id,
    ).first()
    if not invitation:
        raise HTTPException(status_code=404, detail="초대 기록을 찾을 수 없습니다")

    db.delete(invitation)
    db.commit()
    return {"message": "초대가 취소되었습니다"}


# --- Join / Leave / Close ---

@router.post("/{meeting_id}/join")
def join_meeting(
    meeting_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id, Meeting.status == "active").first()
    if not meeting:
        raise HTTPException(status_code=404, detail="활성화된 회의실을 찾을 수 없습니다")

    # Check invitation: creator, admin, or invited user only
    is_creator = meeting.created_by == current_user.id
    is_admin = current_user.role in ("admin", "superadmin")
    is_invited = db.query(MeetingInvitation).filter(
        MeetingInvitation.meeting_id == meeting_id,
        MeetingInvitation.user_id == current_user.id,
    ).first() is not None

    if not (is_creator or is_admin or is_invited):
        raise HTTPException(status_code=403, detail="초대받은 사용자만 입장할 수 있습니다")

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
