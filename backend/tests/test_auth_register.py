def test_register_local_user(client):
    response = client.post("/api/auth/register", json={
        "username": "newuser1", "password": "Pass1234!",
        "email": "new1@example.com", "name": "홍길동",
        "nickname": "길동이1", "phone": "010-1111-2222",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "회원가입이 완료되었습니다. 관리자 승인을 기다려주세요."
    assert data["status"] == "pending"

def test_register_duplicate_username(client):
    client.post("/api/auth/register", json={
        "username": "dupeuser", "password": "Pass1234!",
        "email": "dupe1@example.com", "name": "테스트1",
        "nickname": "듀프1", "phone": "010-0000-0001",
    })
    response = client.post("/api/auth/register", json={
        "username": "dupeuser", "password": "Pass1234!",
        "email": "dupe2@example.com", "name": "테스트2",
        "nickname": "듀프2", "phone": "010-0000-0002",
    })
    assert response.status_code == 409
    assert "아이디" in response.json()["detail"]

def test_register_duplicate_email(client):
    client.post("/api/auth/register", json={
        "username": "emailuser1", "password": "Pass1234!",
        "email": "same@example.com", "name": "테스트1",
        "nickname": "이메일1", "phone": "010-0000-0003",
    })
    response = client.post("/api/auth/register", json={
        "username": "emailuser2", "password": "Pass1234!",
        "email": "same@example.com", "name": "테스트2",
        "nickname": "이메일2", "phone": "010-0000-0004",
    })
    assert response.status_code == 409
    assert "이메일" in response.json()["detail"]

def test_register_invalid_password(client):
    response = client.post("/api/auth/register", json={
        "username": "badpwuser", "password": "short",
        "email": "badpw@example.com", "name": "테스트",
        "nickname": "배드비번", "phone": "010-0000-0005",
    })
    assert response.status_code == 422
