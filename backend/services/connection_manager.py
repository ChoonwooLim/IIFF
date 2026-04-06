from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
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
