import os
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File as FastAPIFile, status
from fastapi.responses import FileResponse as FastAPIFileResponse
from sqlalchemy.orm import Session, joinedload

from config import settings
from deps import get_db, require_active, require_admin
from models.meeting import Meeting
from models.meeting_participant import MeetingParticipant
from models.meeting_invitation import MeetingInvitation
from models.meeting_minutes import MeetingMinutes
from models.chat_message import ChatMessage
from models.user import User
from schemas.meeting import (
    MeetingCreateRequest,
    MeetingUpdateRequest,
    MeetingInviteRequest,
    MeetingPasswordRequest,
    MeetingJoinRequest,
    MeetingResponse,
    MeetingDetailResponse,
    MeetingUserResponse,
    MeetingInvitationResponse,
    MeetingMinutesResponse,
    MeetingMinutesListItem,
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


@router.get("/minutes/list", response_model=list[MeetingMinutesListItem])
def list_all_minutes(
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    minutes = (
        db.query(MeetingMinutes)
        .options(joinedload(MeetingMinutes.creator))
        .order_by(MeetingMinutes.created_at.desc())
        .all()
    )
    return minutes


@router.delete("/minutes/{minutes_id}")
def delete_minutes(
    minutes_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    minutes = db.query(MeetingMinutes).filter(MeetingMinutes.id == minutes_id).first()
    if not minutes:
        raise HTTPException(status_code=404, detail="회의록을 찾을 수 없습니다")

    if minutes.created_by != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="삭제 권한이 없습니다")

    db.delete(minutes)
    db.commit()
    return {"message": "회의록이 삭제되었습니다"}


@router.get("/chat-files/{stored_name}")
def serve_chat_file(stored_name: str):
    from services.storage import get_storage
    storage = get_storage()
    path = storage.get_path(os.path.join(settings.storage_base_path, "chat", stored_name))
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다")
    return FastAPIFileResponse(path=path)


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
            has_password=bool(m.password),
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
    meeting = Meeting(
        name=req.name,
        type=req.type,
        created_by=current_user.id,
        max_participants=req.max_participants,
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


# --- Password ---

@router.put("/{meeting_id}/password")
def set_meeting_password(
    meeting_id: int,
    req: MeetingPasswordRequest,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="회의실을 찾을 수 없습니다")

    if meeting.created_by != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="비밀번호 설정 권한이 없습니다")

    meeting.password = req.password
    db.commit()
    return {"message": "비밀번호가 설정되었습니다"}


@router.delete("/{meeting_id}/password")
def remove_meeting_password(
    meeting_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="회의실을 찾을 수 없습니다")

    if meeting.created_by != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="비밀번호 삭제 권한이 없습니다")

    meeting.password = None
    db.commit()
    return {"message": "비밀번호가 제거되었습니다"}


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
    req: MeetingJoinRequest | None = None,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id, Meeting.status == "active").first()
    if not meeting:
        raise HTTPException(status_code=404, detail="활성화된 회의실을 찾을 수 없습니다")

    # Check access: creator, admin, invited, or correct password
    is_creator = meeting.created_by == current_user.id
    is_admin = current_user.role in ("admin", "superadmin")
    is_invited = db.query(MeetingInvitation).filter(
        MeetingInvitation.meeting_id == meeting_id,
        MeetingInvitation.user_id == current_user.id,
    ).first() is not None
    password_ok = bool(meeting.password and req and req.password and req.password == meeting.password)

    if not (is_creator or is_admin or is_invited or password_ok):
        if meeting.password:
            raise HTTPException(status_code=403, detail="비밀번호가 올바르지 않습니다")
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


# --- Chat file upload ---


@router.post("/{meeting_id}/chat-files")
def upload_chat_file(
    meeting_id: int,
    file: UploadFile = FastAPIFile(...),
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="회의실을 찾을 수 없습니다")

    if not file.filename:
        raise HTTPException(status_code=400, detail="파일 이름이 없습니다")

    ext = os.path.splitext(file.filename)[1].lower()
    allowed = settings.allowed_image_extensions + settings.allowed_document_extensions + [".mp4", ".webm", ".mov"]
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=f"허용되지 않는 파일 형식입니다: {ext}")

    content = file.file.read()
    file_size = len(content)
    file.file.seek(0)

    max_size = settings.max_file_size_image if ext in settings.allowed_image_extensions else 50 * 1024 * 1024
    if file_size > max_size:
        raise HTTPException(status_code=400, detail="파일 크기가 초과되었습니다")

    from services.storage import get_storage
    storage = get_storage()
    directory = "chat"
    stored_name, file_path, _ = storage.upload(file, directory)

    serve_url = f"/api/meetings/chat-files/{stored_name}"

    msg = ChatMessage(
        meeting_id=meeting_id,
        user_id=current_user.id,
        content=file.filename,
        file_url=serve_url,
        file_name=file.filename,
        file_type=file.content_type or "application/octet-stream",
        file_size=file_size,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    return {
        "id": msg.id,
        "file_url": serve_url,
        "file_name": file.filename,
        "file_type": file.content_type,
        "file_size": file_size,
    }



# --- Meeting Minutes ---


@router.post("/{meeting_id}/minutes", status_code=status.HTTP_201_CREATED, response_model=MeetingMinutesResponse)
def create_minutes(
    meeting_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    meeting = db.query(Meeting).options(joinedload(Meeting.creator)).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="회의실을 찾을 수 없습니다")

    if meeting.status != "closed":
        raise HTTPException(status_code=400, detail="종료된 회의만 회의록을 생성할 수 있습니다")

    if meeting.created_by != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="회의록 생성 권한이 없습니다")

    # Check if minutes already exist
    existing = db.query(MeetingMinutes).filter(MeetingMinutes.meeting_id == meeting_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="이미 회의록이 생성되었습니다")

    # Gather data
    messages = (
        db.query(ChatMessage)
        .options(joinedload(ChatMessage.user))
        .filter(ChatMessage.meeting_id == meeting_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )

    participants = (
        db.query(MeetingParticipant)
        .options(joinedload(MeetingParticipant.user))
        .filter(MeetingParticipant.meeting_id == meeting_id)
        .all()
    )

    unique_participants = {p.user.nickname for p in participants if p.user}

    # Build document
    created_str = meeting.created_at.strftime("%Y년 %m월 %d일 %H:%M") if meeting.created_at else ""
    closed_str = meeting.closed_at.strftime("%Y년 %m월 %d일 %H:%M") if meeting.closed_at else ""

    lines = []
    lines.append(f"# {meeting.name} — 회의록")
    lines.append("")
    lines.append(f"**회의 유형:** {'화상 회의' if meeting.type == 'video' else '텍스트 채팅'}")
    lines.append(f"**개설자:** {meeting.creator.nickname}")
    lines.append(f"**시작:** {created_str}")
    lines.append(f"**종료:** {closed_str}")
    lines.append(f"**참여자:** {', '.join(sorted(unique_participants))}")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 대화 내용")
    lines.append("")

    current_date = None
    for msg in messages:
        msg_date = msg.created_at.strftime("%Y-%m-%d")
        if msg_date != current_date:
            current_date = msg_date
            lines.append(f"### {msg.created_at.strftime('%Y년 %m월 %d일')}")
            lines.append("")

        time_str = msg.created_at.strftime("%H:%M")
        lines.append(f"**[{time_str}] {msg.user.nickname}:** {msg.content}")
        lines.append("")

    if not messages:
        lines.append("*대화 내용이 없습니다.*")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append(f"*총 {len(messages)}개의 메시지 · {len(unique_participants)}명 참여*")

    content = "\n".join(lines)
    title = f"{meeting.name} — 회의록 ({created_str})"

    minutes = MeetingMinutes(
        meeting_id=meeting_id,
        title=title,
        content=content,
        created_by=current_user.id,
    )
    db.add(minutes)
    db.commit()
    db.refresh(minutes)

    return minutes


@router.get("/{meeting_id}/minutes", response_model=MeetingMinutesResponse)
def get_minutes(
    meeting_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    minutes = (
        db.query(MeetingMinutes)
        .options(joinedload(MeetingMinutes.creator))
        .filter(MeetingMinutes.meeting_id == meeting_id)
        .first()
    )
    if not minutes:
        raise HTTPException(status_code=404, detail="회의록이 없습니다")
    return minutes


