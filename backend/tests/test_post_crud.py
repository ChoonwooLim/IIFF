def _register_and_activate(client, username, email, nickname):
    client.post("/api/auth/register", json={
        "username": username, "password": "Pass1234!",
        "email": email, "name": "테스트유저",
        "nickname": nickname, "phone": "010-0000-0000",
    })
    from tests.conftest import override_activate_user
    override_activate_user(client, username)
    resp = client.post("/api/auth/login", json={
        "username": username, "password": "Pass1234!",
    })
    return resp.json()["access_token"]


def _ensure_board(client, slug, name, board_type):
    from models.board import Board
    from deps import get_db
    from main import app
    db = next(app.dependency_overrides[get_db]())
    board = db.query(Board).filter(Board.slug == slug).first()
    if not board:
        board = Board(slug=slug, name=name, board_type=board_type)
        db.add(board)
        db.commit()
        db.refresh(board)
    return board


def test_list_boards(client):
    _ensure_board(client, "notice", "공지사항", "general")
    _ensure_board(client, "suggestion", "건의사항", "general")
    _ensure_board(client, "image", "이미지", "image")

    response = client.get("/api/boards")
    assert response.status_code == 200
    assert len(response.json()) >= 3


def test_create_post(client):
    token = _register_and_activate(client, "postuser1", "post1@test.com", "포스트유저1")
    board = _ensure_board(client, "suggestion", "건의사항", "general")

    response = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "테스트 글", "content": "내용입니다"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    assert response.json()["title"] == "테스트 글"


def test_get_post(client):
    token = _register_and_activate(client, "postuser2", "post2@test.com", "포스트유저2")
    board = _ensure_board(client, "suggestion", "건의사항", "general")

    resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "조회 테스트", "content": "본문"},
        headers={"Authorization": f"Bearer {token}"},
    )
    post_id = resp.json()["id"]

    response = client.get(f"/api/posts/{post_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "조회 테스트"
    assert response.json()["view_count"] == 1


def test_list_posts(client):
    _ensure_board(client, "suggestion", "건의사항", "general")
    response = client.get("/api/boards/suggestion/posts")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data


def test_notice_board_requires_admin(client):
    token = _register_and_activate(client, "normaluser", "normal@test.com", "일반유저")
    board = _ensure_board(client, "notice", "공지사항", "general")

    response = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "공지 테스트", "content": "내용"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403


def test_delete_post(client):
    token = _register_and_activate(client, "deluser", "del@test.com", "삭제유저")
    board = _ensure_board(client, "suggestion", "건의사항", "general")

    resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "삭제 테스트", "content": "삭제할 글"},
        headers={"Authorization": f"Bearer {token}"},
    )
    post_id = resp.json()["id"]

    response = client.delete(f"/api/posts/{post_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 204
