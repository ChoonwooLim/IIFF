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

def test_adopt_answer(client):
    asker_token = _register_and_activate(client, "asker1", "asker1@test.com", "질문자")
    answerer_token = _register_and_activate(client, "answerer1", "answerer1@test.com", "답변자")
    board = _ensure_board(client, "qna", "Q&A", "qna")
    post_resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "질문입니다", "content": "어떻게 해야 하나요?"},
        headers={"Authorization": f"Bearer {asker_token}"})
    post_id = post_resp.json()["id"]
    cmt_resp = client.post(f"/api/posts/{post_id}/comments",
        json={"content": "이렇게 하면 됩니다"},
        headers={"Authorization": f"Bearer {answerer_token}"})
    comment_id = cmt_resp.json()["id"]
    response = client.post(f"/api/comments/{comment_id}/adopt",
        headers={"Authorization": f"Bearer {asker_token}"})
    assert response.status_code == 200
    assert response.json()["adopted_comment_id"] == comment_id

def test_only_asker_can_adopt(client):
    asker_token = _register_and_activate(client, "asker2", "asker2@test.com", "질문자2")
    answerer_token = _register_and_activate(client, "answerer2", "answerer2@test.com", "답변자2")
    board = _ensure_board(client, "qna", "Q&A", "qna")
    post_resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "질문2", "content": "본문"},
        headers={"Authorization": f"Bearer {asker_token}"})
    post_id = post_resp.json()["id"]
    cmt_resp = client.post(f"/api/posts/{post_id}/comments",
        json={"content": "답변"},
        headers={"Authorization": f"Bearer {answerer_token}"})
    comment_id = cmt_resp.json()["id"]
    response = client.post(f"/api/comments/{comment_id}/adopt",
        headers={"Authorization": f"Bearer {answerer_token}"})
    assert response.status_code == 403

def test_adopt_only_on_qna_board(client):
    token = _register_and_activate(client, "noqna", "noqna@test.com", "비큐에이")
    board = _ensure_board(client, "suggestion", "건의사항", "general")
    post_resp = client.post("/api/posts",
        data={"board_id": str(board.id), "title": "일반글", "content": "본문"},
        headers={"Authorization": f"Bearer {token}"})
    post_id = post_resp.json()["id"]
    cmt_resp = client.post(f"/api/posts/{post_id}/comments",
        json={"content": "댓글"},
        headers={"Authorization": f"Bearer {token}"})
    comment_id = cmt_resp.json()["id"]
    response = client.post(f"/api/comments/{comment_id}/adopt",
        headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 400
