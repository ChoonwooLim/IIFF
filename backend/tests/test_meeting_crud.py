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


def test_create_video_meeting(client):
    token = _register_and_activate(client, "meethost1", "meethost1@test.com", "미팅호스트1")
    response = client.post("/api/meetings",
        json={"name": "테스트 화상회의", "type": "video"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["type"] == "video"
    assert data["jitsi_room_id"] is not None
    assert data["jitsi_room_id"].startswith("iiff-")


def test_create_text_meeting(client):
    token = _register_and_activate(client, "meethost2", "meethost2@test.com", "미팅호스트2")
    response = client.post("/api/meetings",
        json={"name": "텍스트 채팅방", "type": "text"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    assert response.json()["jitsi_room_id"] is None


def test_list_meetings(client):
    response = client.get("/api/meetings")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_join_and_leave_meeting(client):
    token = _register_and_activate(client, "joiner1", "joiner1@test.com", "참여자1")
    create_resp = client.post("/api/meetings",
        json={"name": "참여 테스트", "type": "text"},
        headers={"Authorization": f"Bearer {token}"},
    )
    meeting_id = create_resp.json()["id"]

    join_resp = client.post(f"/api/meetings/{meeting_id}/join",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert join_resp.status_code == 200

    leave_resp = client.post(f"/api/meetings/{meeting_id}/leave",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert leave_resp.status_code == 200


def test_close_meeting(client):
    token = _register_and_activate(client, "closer1", "closer1@test.com", "종료자1")
    create_resp = client.post("/api/meetings",
        json={"name": "종료 테스트", "type": "text"},
        headers={"Authorization": f"Bearer {token}"},
    )
    meeting_id = create_resp.json()["id"]

    close_resp = client.post(f"/api/meetings/{meeting_id}/close",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert close_resp.status_code == 200


def test_get_meeting_detail(client):
    token = _register_and_activate(client, "detailuser", "detail@test.com", "디테일유저")
    create_resp = client.post("/api/meetings",
        json={"name": "상세 테스트", "type": "video"},
        headers={"Authorization": f"Bearer {token}"},
    )
    meeting_id = create_resp.json()["id"]

    response = client.get(f"/api/meetings/{meeting_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "상세 테스트"
