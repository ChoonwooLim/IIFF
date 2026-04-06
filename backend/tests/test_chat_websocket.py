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


def test_websocket_connect_without_token(client):
    from main import app
    with pytest.raises(Exception):
        with client.websocket_connect("/ws/meetings/1"):
            pass


def test_websocket_requires_valid_token(client):
    with pytest.raises(Exception):
        with client.websocket_connect("/ws/meetings/1?token=invalid"):
            pass
