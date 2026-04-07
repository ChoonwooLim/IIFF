from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from database import SessionLocal
from models.user import User
from services.auth_service import decode_token
from services.notification_manager import notification_manager

router = APIRouter()


def get_user_from_token(token: str, db: Session) -> User | None:
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        return None
    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    return user


@router.websocket("/ws/notifications")
async def websocket_notifications(websocket: WebSocket):
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

        await notification_manager.connect(websocket, user.id)

        try:
            while True:
                # Keep connection alive; ignore client messages
                await websocket.receive_text()
        except WebSocketDisconnect:
            pass
        finally:
            notification_manager.disconnect(websocket, user.id)
    finally:
        db.close()
