import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from deps import get_db
from main import app
import models.user  # noqa: F401 — ensure User table is registered with Base
import models.board  # noqa: F401
import models.post  # noqa: F401
import models.comment  # noqa: F401
import models.file  # noqa: F401
import models.meeting  # noqa: F401
import models.meeting_participant  # noqa: F401
import models.chat_message  # noqa: F401

SQLALCHEMY_TEST_URL = "sqlite:///./test.db"
engine_test = create_engine(SQLALCHEMY_TEST_URL, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(bind=engine_test, autocommit=False, autoflush=False)


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)


@pytest.fixture()
def db_session():
    session = TestSessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()


@pytest.fixture()
def client(db_session):
    def override_get_db():
        yield db_session
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def override_activate_user(client, username: str):
    """Test helper: directly activate a user in the DB."""
    from sqlalchemy import text
    db = next(app.dependency_overrides[get_db]())
    db.execute(
        text("UPDATE users SET status = 'active' WHERE username = :username"),
        {"username": username},
    )
    db.commit()


def override_activate_user_by_email(client, email: str):
    from sqlalchemy import text
    db = next(app.dependency_overrides[get_db]())
    db.execute(
        text("UPDATE users SET status = 'active' WHERE email = :email"),
        {"email": email},
    )
    db.commit()
