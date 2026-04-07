from fastapi import WebSocket


class NotificationManager:
    def __init__(self):
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int):
        if user_id in self.active_connections:
            self.active_connections[user_id] = [
                ws for ws in self.active_connections[user_id] if ws != websocket
            ]
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    def is_online(self, user_id: int) -> bool:
        return user_id in self.active_connections and len(self.active_connections[user_id]) > 0

    async def send_to_user(self, user_id: int, data: dict) -> bool:
        """Send data to user. Returns True if delivered to at least one connection."""
        if user_id not in self.active_connections:
            return False
        delivered = False
        disconnected = []
        for ws in self.active_connections[user_id]:
            try:
                await ws.send_json(data)
                delivered = True
            except Exception:
                disconnected.append(ws)
        for ws in disconnected:
            self.disconnect(ws, user_id)
        return delivered


notification_manager = NotificationManager()
