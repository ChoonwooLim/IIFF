import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from models.user import User

engine_test = create_engine("sqlite:///./test_user.db", connect_args={"check_same_thread": False})
TestSession = sessionmaker(bind=engine_test)


@pytest.fixture(scope="module", autouse=True)
def setup():
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)
    engine_test.dispose()
    import os
    os.remove("./test_user.db") if os.path.exists("./test_user.db") else None


@pytest.fixture()
def db():
    session = TestSession()
    yield session
    session.rollback()
    session.close()


def test_create_local_user(db):
    user = User(
        auth_provider="local",
        username="testuser",
        password_hash="hashed_pw",
        email="test@example.com",
        name="홍길동",
        nickname="길동이",
        phone="010-1234-5678",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    assert user.id is not None
    assert user.auth_provider == "local"
    assert user.role == "user"
    assert user.status == "pending"
    assert user.google_id is None


def test_create_google_user(db):
    user = User(
        auth_provider="google",
        google_id="google_123456",
        email="google@example.com",
        name="김철수",
        nickname="철수",
        phone="010-9876-5432",
        profile_image="https://lh3.googleusercontent.com/photo.jpg",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    assert user.id is not None
    assert user.auth_provider == "google"
    assert user.username is None
    assert user.password_hash is None
    assert user.google_id == "google_123456"


def test_email_unique_constraint(db):
    user1 = User(
        auth_provider="local",
        username="user1",
        password_hash="hash1",
        email="duplicate@example.com",
        name="테스트1",
        nickname="닉1",
        phone="010-0000-0001",
    )
    db.add(user1)
    db.commit()
    user2 = User(
        auth_provider="local",
        username="user2",
        password_hash="hash2",
        email="duplicate@example.com",
        name="테스트2",
        nickname="닉2",
        phone="010-0000-0002",
    )
    db.add(user2)
    with pytest.raises(Exception):
        db.commit()
