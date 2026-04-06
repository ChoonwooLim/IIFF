def test_login_success(client):
    client.post("/api/auth/register", json={
        "username": "loginuser", "password": "Pass1234!",
        "email": "login@example.com", "name": "로그인유저",
        "nickname": "로그인테스트", "phone": "010-3333-4444",
    })
    from tests.conftest import override_activate_user
    override_activate_user(client, "loginuser")
    response = client.post("/api/auth/login", json={
        "username": "loginuser", "password": "Pass1234!",
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(client):
    client.post("/api/auth/register", json={
        "username": "wrongpw", "password": "Pass1234!",
        "email": "wrongpw@example.com", "name": "테스트",
        "nickname": "틀린비번", "phone": "010-5555-6666",
    })
    from tests.conftest import override_activate_user
    override_activate_user(client, "wrongpw")
    response = client.post("/api/auth/login", json={
        "username": "wrongpw", "password": "WrongPass1!",
    })
    assert response.status_code == 401

def test_login_pending_user(client):
    client.post("/api/auth/register", json={
        "username": "pendinglogin", "password": "Pass1234!",
        "email": "pending@example.com", "name": "대기유저",
        "nickname": "대기중", "phone": "010-7777-8888",
    })
    response = client.post("/api/auth/login", json={
        "username": "pendinglogin", "password": "Pass1234!",
    })
    assert response.status_code == 403
    assert "승인" in response.json()["detail"]

def test_get_current_user(client):
    client.post("/api/auth/register", json={
        "username": "meuser", "password": "Pass1234!",
        "email": "me@example.com", "name": "내정보",
        "nickname": "미유저", "phone": "010-9999-0000",
    })
    from tests.conftest import override_activate_user
    override_activate_user(client, "meuser")
    login_resp = client.post("/api/auth/login", json={
        "username": "meuser", "password": "Pass1234!",
    })
    token = login_resp.json()["access_token"]
    response = client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "me@example.com"
    assert data["role"] == "user"
    assert data["status"] == "active"
