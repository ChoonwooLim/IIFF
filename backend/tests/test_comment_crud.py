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

def test_create_comment(client):
    token = _register_and_activate(client, "cmtuser1", "cmt1@test.com", "댓글유저1")
    board = _ensure_board(client, "suggestion", "건의사항", "general")
    post_resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "댓글 테스트 글", "content": "본문"},
        headers={"Authorization": f"Bearer {token}"})
    post_id = post_resp.json()["id"]
    response = client.post(f"/api/posts/{post_id}/comments",
        json={"content": "첫 댓글입니다"},
        headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    assert response.json()["content"] == "첫 댓글입니다"

def test_create_reply(client):
    token = _register_and_activate(client, "cmtuser2", "cmt2@test.com", "댓글유저2")
    board = _ensure_board(client, "suggestion", "건의사항", "general")
    post_resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "대댓글 테스트", "content": "본문"},
        headers={"Authorization": f"Bearer {token}"})
    post_id = post_resp.json()["id"]
    cmt_resp = client.post(f"/api/posts/{post_id}/comments",
        json={"content": "부모 댓글"},
        headers={"Authorization": f"Bearer {token}"})
    parent_id = cmt_resp.json()["id"]
    response = client.post(f"/api/posts/{post_id}/comments",
        json={"content": "대댓글입니다", "parent_id": parent_id},
        headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    assert response.json()["parent_id"] == parent_id

def test_list_comments(client):
    token = _register_and_activate(client, "cmtuser3", "cmt3@test.com", "댓글유저3")
    board = _ensure_board(client, "suggestion", "건의사항", "general")
    post_resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "목록 테스트", "content": "본문"},
        headers={"Authorization": f"Bearer {token}"})
    post_id = post_resp.json()["id"]
    client.post(f"/api/posts/{post_id}/comments", json={"content": "댓글1"},
        headers={"Authorization": f"Bearer {token}"})
    client.post(f"/api/posts/{post_id}/comments", json={"content": "댓글2"},
        headers={"Authorization": f"Bearer {token}"})
    response = client.get(f"/api/posts/{post_id}/comments")
    assert response.status_code == 200
    assert len(response.json()) == 2

def test_delete_comment(client):
    token = _register_and_activate(client, "cmtuser4", "cmt4@test.com", "댓글유저4")
    board = _ensure_board(client, "suggestion", "건의사항", "general")
    post_resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "삭제 댓글 테스트", "content": "본문"},
        headers={"Authorization": f"Bearer {token}"})
    post_id = post_resp.json()["id"]
    cmt_resp = client.post(f"/api/posts/{post_id}/comments", json={"content": "삭제할 댓글"},
        headers={"Authorization": f"Bearer {token}"})
    comment_id = cmt_resp.json()["id"]
    response = client.delete(f"/api/comments/{comment_id}",
        headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 204
