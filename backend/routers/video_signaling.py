from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from database import SessionLocal
from models.meeting import Meeting
from models.meeting_invitation import MeetingInvitation
from models.user import User
from services.auth_service import decode_token
from services.video_connection_manager import video_manager

router = APIRouter()


def get_user_from_token(token: str, db: Session) -> User | None:
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        return None
    return db.query(User).filter(User.id == int(payload["sub"])).first()


@router.websocket("/ws/video/{meeting_id}")
async def websocket_video_signaling(websocket: WebSocket, meeting_id: int):
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

        if meeting.type != "video":
            await websocket.close(code=4005, reason="Not a video meeting")
            return

        # Access control: creator, admin, invited, or correct password
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

        user_info = {
            "id": user.id,
            "nickname": user.nickname,
            "profile_image": user.profile_image,
        }

        # Connect and get existing peers
        peers = await video_manager.connect(websocket, meeting_id, user.id, user_info)

        # Send room-joined to the new user
        await websocket.send_json({
            "type": "room-joined",
            "user": user_info,
            "peers": peers,
        })

        # Notify existing peers
        await video_manager.broadcast(meeting_id, {
            "type": "peer-joined",
            "user": user_info,
        }, exclude_user_id=user.id)

        try:
            while True:
                data = await websocket.receive_json()
                msg_type = data.get("type")
                target_id = data.get("target_user_id")

                if msg_type == "offer" and target_id:
                    await video_manager.send_to_user(meeting_id, target_id, {
                        "type": "offer",
                        "from_user": user_info,
                        "sdp": data.get("sdp"),
                    })

                elif msg_type == "answer" and target_id:
                    await video_manager.send_to_user(meeting_id, target_id, {
                        "type": "answer",
                        "from_user": user_info,
                        "sdp": data.get("sdp"),
                    })

                elif msg_type == "ice-candidate" and target_id:
                    await video_manager.send_to_user(meeting_id, target_id, {
                        "type": "ice-candidate",
                        "from_user": user_info,
                        "candidate": data.get("candidate"),
                    })

                elif msg_type == "media-state":
                    await video_manager.broadcast(meeting_id, {
                        "type": "media-state",
                        "user_id": user.id,
                        "video": data.get("video", True),
                        "audio": data.get("audio", True),
                    }, exclude_user_id=user.id)

                elif msg_type == "hand-raise":
                    await video_manager.broadcast(meeting_id, {
                        "type": "hand-raise",
                        "user_id": user.id,
                        "raised": data.get("raised", False),
                    }, exclude_user_id=user.id)

        except WebSocketDisconnect:
            pass
        finally:
            video_manager.disconnect(meeting_id, user.id)
            await video_manager.broadcast(meeting_id, {
                "type": "peer-left",
                "user": user_info,
            })
    finally:
        db.close()
