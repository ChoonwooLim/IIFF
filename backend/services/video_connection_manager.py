from fastapi import WebSocket


class VideoConnectionManager:
    """WebSocket manager for video signaling with unicast support."""

    def __init__(self):
        # {meeting_id: {user_id: (websocket, user_info)}}
        self.active_connections: dict[int, dict[int, tuple[WebSocket, dict]]] = {}

    async def connect(self, websocket: WebSocket, meeting_id: int, user_id: int, user_info: dict) -> list[dict]:
        """Accept connection and return list of existing peers."""
        await websocket.accept()
        if meeting_id not in self.active_connections:
            self.active_connections[meeting_id] = {}
        peers = [info for _, info in self.active_connections[meeting_id].values()]
        self.active_connections[meeting_id][user_id] = (websocket, user_info)
        return peers

    def disconnect(self, meeting_id: int, user_id: int):
        if meeting_id in self.active_connections:
            self.active_connections[meeting_id].pop(user_id, None)
            if not self.active_connections[meeting_id]:
                del self.active_connections[meeting_id]

    async def send_to_user(self, meeting_id: int, target_user_id: int, message: dict):
        """Send a message to a specific user (unicast)."""
        if meeting_id in self.active_connections:
            conn = self.active_connections[meeting_id].get(target_user_id)
            if conn:
                ws, _ = conn
                try:
                    await ws.send_json(message)
                except Exception:
                    self.disconnect(meeting_id, target_user_id)

    async def broadcast(self, meeting_id: int, message: dict, exclude_user_id: int | None = None):
        """Broadcast to all peers in a meeting, optionally excluding one."""
        if meeting_id not in self.active_connections:
            return
        disconnected = []
        for uid, (ws, _) in self.active_connections[meeting_id].items():
            if uid == exclude_user_id:
                continue
            try:
                await ws.send_json(message)
            except Exception:
                disconnected.append(uid)
        for uid in disconnected:
            self.disconnect(meeting_id, uid)

    def get_peers(self, meeting_id: int) -> list[dict]:
        if meeting_id not in self.active_connections:
            return []
        return [info for _, info in self.active_connections[meeting_id].values()]


video_manager = VideoConnectionManager()
