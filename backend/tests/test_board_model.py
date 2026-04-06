import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from models.board import Board
from models.post import Post
from models.comment import Comment
from models.file import File
from models.user import User

engine_test = create_engine("sqlite:///./test_board.db", connect_args={"check_same_thread": False})
TestSession = sessionmaker(bind=engine_test)

@pytest.fixture(scope="module", autouse=True)
def setup():
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)
    import os
    engine_test.dispose()
    os.remove("./test_board.db") if os.path.exists("./test_board.db") else None

@pytest.fixture()
def db():
    session = TestSession()
    yield session
    session.rollback()
    session.close()

def test_create_board(db):
    board = Board(slug="notice", name="공지사항", board_type="general")
    db.add(board)
    db.commit()
    db.refresh(board)
    assert board.id is not None
    assert board.slug == "notice"
    assert board.is_active is True

def test_create_post_with_board(db):
    board = Board(slug="test-board", name="테스트", board_type="general")
    db.add(board)
    db.commit()
    user = User(auth_provider="local", username="poster", password_hash="hash",
        email="poster@test.com", name="작성자", nickname="포스터", phone="010-0000-0000")
    db.add(user)
    db.commit()
    post = Post(board_id=board.id, user_id=user.id, title="테스트 글", content="내용입니다")
    db.add(post)
    db.commit()
    db.refresh(post)
    assert post.id is not None
    assert post.view_count == 0
    assert post.is_pinned is False

def test_create_comment_with_reply(db):
    board = Board(slug="comment-board", name="댓글테스트", board_type="general")
    db.add(board)
    db.commit()
    user = User(auth_provider="local", username="commenter", password_hash="hash",
        email="commenter@test.com", name="댓글러", nickname="코멘터", phone="010-1111-1111")
    db.add(user)
    db.commit()
    post = Post(board_id=board.id, user_id=user.id, title="댓글 테스트", content="본문")
    db.add(post)
    db.commit()
    comment = Comment(post_id=post.id, user_id=user.id, content="첫 댓글")
    db.add(comment)
    db.commit()
    reply = Comment(post_id=post.id, user_id=user.id, parent_id=comment.id, content="대댓글")
    db.add(reply)
    db.commit()
    db.refresh(reply)
    assert reply.parent_id == comment.id

def test_create_file(db):
    user = User(auth_provider="local", username="uploader", password_hash="hash",
        email="uploader@test.com", name="업로더", nickname="업로더", phone="010-2222-2222")
    db.add(user)
    db.commit()
    file = File(user_id=user.id, original_name="test.pdf",
        stored_name="uuid-123.pdf", file_path="/uploads/uuid-123.pdf",
        file_size=1024, mime_type="application/pdf")
    db.add(file)
    db.commit()
    db.refresh(file)
    assert file.id is not None
    assert file.post_id is None
