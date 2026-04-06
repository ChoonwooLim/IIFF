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


def _make_admin(client, username):
    from sqlalchemy import text
    from main import app
    from deps import get_db
    db = next(app.dependency_overrides[get_db]())
    db.execute(text("UPDATE users SET role = 'admin' WHERE username = :username"), {"username": username})
    db.commit()


def _make_superadmin(client, username):
    from sqlalchemy import text
    from main import app
    from deps import get_db
    db = next(app.dependency_overrides[get_db]())
    db.execute(text("UPDATE users SET role = 'superadmin' WHERE username = :username"), {"username": username})
    db.commit()


def test_non_admin_cannot_access(client):
    token = _register_and_activate(client, "normaluser1", "normal1@test.com", "일반유저1")
    response = client.get("/api/admin/stats", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403


def test_admin_gets_stats(client):
    token = _register_and_activate(client, "adminstat1", "adminstat1@test.com", "관리자통계1")
    _make_admin(client, "adminstat1")
    response = client.get("/api/admin/stats", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert "total_users" in data
    assert "pending_users" in data


def test_admin_list_users(client):
    token = _register_and_activate(client, "adminlist1", "adminlist1@test.com", "관리자목록1")
    _make_admin(client, "adminlist1")
    response = client.get("/api/admin/users", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert "users" in response.json()
    assert "total" in response.json()


def test_admin_update_user_status(client):
    client.post("/api/auth/register", json={
        "username": "target1", "password": "Pass1234!",
        "email": "target1@test.com", "name": "대상유저",
        "nickname": "대상유저1", "phone": "010-1111-1111",
    })
    from tests.conftest import override_activate_user
    override_activate_user(client, "target1")

    token = _register_and_activate(client, "adminmod1", "adminmod1@test.com", "관리자변경1")
    _make_admin(client, "adminmod1")

    users_resp = client.get("/api/admin/users", headers={"Authorization": f"Bearer {token}"})
    target = [u for u in users_resp.json()["users"] if u["username"] == "target1"][0]

    resp = client.patch(
        f"/api/admin/users/{target['id']}/status",
        json={"status": "banned"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200


def test_only_superadmin_can_change_role(client):
    _register_and_activate(client, "roletarget1", "roletarget1@test.com", "역할대상1")
    token_admin = _register_and_activate(client, "roleadmin1", "roleadmin1@test.com", "역할관리자1")
    _make_admin(client, "roleadmin1")

    users_resp = client.get("/api/admin/users", headers={"Authorization": f"Bearer {token_admin}"})
    target = [u for u in users_resp.json()["users"] if u["username"] == "roletarget1"][0]

    resp = client.patch(
        f"/api/admin/users/{target['id']}/role",
        json={"role": "admin"},
        headers={"Authorization": f"Bearer {token_admin}"},
    )
    assert resp.status_code == 403

    _make_superadmin(client, "roleadmin1")
    resp = client.patch(
        f"/api/admin/users/{target['id']}/role",
        json={"role": "admin"},
        headers={"Authorization": f"Bearer {token_admin}"},
    )
    assert resp.status_code == 200


def test_admin_toggle_post_visibility(client):
    token = _register_and_activate(client, "postmod1", "postmod1@test.com", "게시글관리1")
    _make_admin(client, "postmod1")

    from models.board import Board
    from main import app
    from deps import get_db
    db = next(app.dependency_overrides[get_db]())
    board = db.query(Board).first()
    if not board:
        board = Board(slug="general", name="일반", board_type="general")
        db.add(board)
        db.commit()
        db.refresh(board)

    resp = client.post(
        "/api/posts",
        data={"title": "테스트 게시글", "content": "내용입니다", "board_id": str(board.id)},
        headers={"Authorization": f"Bearer {token}"},
    )
    post_id = resp.json()["id"]

    hide_resp = client.patch(f"/api/admin/posts/{post_id}/hide", headers={"Authorization": f"Bearer {token}"})
    assert hide_resp.status_code == 200
    assert hide_resp.json()["is_hidden"] is True

    unhide_resp = client.patch(f"/api/admin/posts/{post_id}/hide", headers={"Authorization": f"Bearer {token}"})
    assert unhide_resp.status_code == 200
    assert unhide_resp.json()["is_hidden"] is False
