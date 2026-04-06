from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models.chat_message import ChatMessage
from models.meeting import Meeting
from models.meeting_invitation import MeetingInvitation
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

        # Check access: creator, admin, invited, or correct password
        is_creator = meeting.created_by == user.id
        is_admin = user.role in ("admin", "superadmin")
        is_invited = db.query(MeetingInvitation).filter(
            MeetingInvitation.meeting_id == meeting_id,
            MeetingInvitation.user_id == user.id,
        ).first() is not None
        ws_password = websocket.query_params.get("password", "")
        password_ok = bool(meeting.password and ws_password and ws_password == meeting.password)

        if not (is_creator or is_admin or is_invited or password_ok):
            await websocket.close(code=4006, reason="Not invited")
            return

        user_info = {"id": user.id, "nickname": user.nickname, "profile_image": user.profile_image}

        await manager.connect(websocket, meeting_id, user_info)

        await manager.broadcast(meeting_id, {
            "type": "user_joined",
            "user": user_info,
        })

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
                        msg = ChatMessage(
                            meeting_id=meeting_id,
                            user_id=user.id,
                            content=content,
                        )
                        db.add(msg)
                        db.commit()

                        await manager.broadcast(meeting_id, {
                            "type": "new_message",
                            "user": user_info,
                            "content": content,
                            "timestamp": datetime.now(timezone.utc).isoformat(),
                        })

                elif data.get("type") == "file_message":
                    # File already uploaded via REST, just broadcast to others
                    await manager.broadcast(meeting_id, {
                        "type": "new_message",
                        "user": user_info,
                        "content": data.get("file_name", ""),
                        "file_url": data.get("file_url"),
                        "file_name": data.get("file_name"),
                        "file_type": data.get("file_type"),
                        "file_size": data.get("file_size"),
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
