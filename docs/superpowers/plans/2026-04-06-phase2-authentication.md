# Phase 2: Authentication System — Google OAuth + Local Signup + Admin Approval

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dual authentication (Google OAuth 2.0 + local username/password), JWT token management, admin approval workflow, and frontend auth pages.

**Architecture:** FastAPI backend handles auth via `/api/auth/` routes. Google OAuth uses authorization code flow. Passwords hashed with bcrypt. JWT access tokens (30min) in memory + refresh tokens (7d) in httpOnly cookies. Frontend uses React Router protected routes + axios interceptors for token management.

**Tech Stack:** FastAPI, SQLAlchemy 2.0, Alembic, bcrypt, python-jose (JWT), Google OAuth 2.0, React, React Router, axios, shadcn/ui (later phases)

---

## File Structure

### Backend — New/Modified Files

```
backend/
├── models/
│   ├── __init__.py            # (modify) import User
│   └── user.py                # User SQLAlchemy model
├── routers/
│   ├── __init__.py
│   └── auth.py                # Auth endpoints (register, login, google, refresh, me)
├── services/
│   ├── __init__.py
│   └── auth_service.py        # JWT creation/verification, password hashing, Google OAuth
├── schemas/
│   ├── __init__.py
│   └── auth.py                # Pydantic request/response schemas
├── deps.py                    # (modify) add get_current_user, require_active, require_admin
├── main.py                    # (modify) mount auth router
├── config.py                  # (already has JWT + Google settings)
└── tests/
    ├── test_auth_register.py  # Local registration tests
    ├── test_auth_login.py     # Login + JWT tests
    └── test_auth_permissions.py  # Permission/status checks
```

### Frontend — New/Modified Files

```
frontend/src/
├── services/
│   └── api.ts                 # Axios instance with interceptors
├── hooks/
│   ├── useAuth.ts             # Auth state management hook
│   └── AuthContext.tsx         # Auth context provider
├── pages/
│   └── Auth/
│       ├── LoginPage.tsx      # Login form (local + Google)
│       ├── RegisterPage.tsx   # Registration form (local + Google)
│       ├── ProfileCompletePage.tsx  # Google signup: complete profile
│       └── PendingPage.tsx    # "Awaiting approval" screen
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx # Route guard for auth
├── App.tsx                    # (modify) add auth routes + provider
└── main.tsx                   # (modify) wrap with AuthProvider
```

---

## Task 1: User Model + Alembic Migration

**Files:**
- Create: `backend/models/user.py`
- Modify: `backend/models/__init__.py`
- Create: Alembic migration file (auto-generated)

- [ ] **Step 1: Write the User model test**

Create `backend/tests/test_user_model.py`:

```python
# backend/tests/test_user_model.py
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
    with pytest.raises(Exception):  # IntegrityError
        db.commit()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/test_user_model.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'models.user'`

- [ ] **Step 3: Create User model**

```python
# backend/models/user.py
from datetime import datetime

from sqlalchemy import String, Enum, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    auth_provider: Mapped[str] = mapped_column(
        Enum("local", "google", name="auth_provider_enum", create_constraint=True),
        nullable=False,
    )
    google_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    username: Mapped[str | None] = mapped_column(String(20), unique=True, nullable=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    nickname: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    profile_image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    role: Mapped[str] = mapped_column(
        Enum("user", "admin", "superadmin", name="role_enum", create_constraint=True),
        default="user",
        server_default="user",
    )
    status: Mapped[str] = mapped_column(
        Enum("pending", "active", "rejected", "banned", name="status_enum", create_constraint=True),
        default="pending",
        server_default="pending",
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
```

- [ ] **Step 4: Update models/__init__.py**

```python
# backend/models/__init__.py
from database import Base
from models.user import User

__all__ = ["Base", "User"]
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/test_user_model.py -v`
Expected: 3 passed.

- [ ] **Step 6: Generate Alembic migration**

Run:
```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m alembic revision --autogenerate -m "create users table"
```
Expected: Creates migration file in `alembic/versions/`.

- [ ] **Step 7: Apply migration to PostgreSQL**

Run:
```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m alembic upgrade head
```
Expected: `Running upgrade -> xxxx, create users table`

- [ ] **Step 8: Verify table exists in PostgreSQL**

Run:
```bash
docker compose exec postgres psql -U iiff_user -d iiff_db -c "\d users"
```
Expected: Shows users table columns.

- [ ] **Step 9: Commit**

```bash
cd c:\WORK\IIFF && git add backend/models/ backend/tests/test_user_model.py backend/alembic/ && git commit -m "feat(backend): add User model with dual auth support and migration"
```

---

## Task 2: Auth Service (JWT + Password Hashing)

**Files:**
- Create: `backend/services/__init__.py`
- Create: `backend/services/auth_service.py`
- Create: `backend/tests/test_auth_service.py`

- [ ] **Step 1: Write auth service tests**

```python
# backend/tests/test_auth_service.py
import pytest
from datetime import timedelta


def test_password_hashing():
    from services.auth_service import hash_password, verify_password

    password = "TestPass123!"
    hashed = hash_password(password)

    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrong_password", hashed) is False


def test_create_access_token():
    from services.auth_service import create_access_token, decode_token

    token = create_access_token(data={"sub": "1", "role": "user"})
    payload = decode_token(token)

    assert payload is not None
    assert payload["sub"] == "1"
    assert payload["role"] == "user"
    assert "exp" in payload


def test_create_refresh_token():
    from services.auth_service import create_refresh_token, decode_token

    token = create_refresh_token(data={"sub": "1"})
    payload = decode_token(token)

    assert payload is not None
    assert payload["sub"] == "1"
    assert payload["type"] == "refresh"


def test_expired_token():
    from services.auth_service import create_access_token, decode_token

    token = create_access_token(
        data={"sub": "1", "role": "user"},
        expires_delta=timedelta(seconds=-1),
    )
    payload = decode_token(token)
    assert payload is None


def test_invalid_token():
    from services.auth_service import decode_token

    payload = decode_token("invalid.token.here")
    assert payload is None
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/test_auth_service.py -v`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 3: Implement auth service**

```python
# backend/services/__init__.py
```

```python
# backend/services/auth_service.py
from datetime import datetime, timedelta, timezone

import bcrypt
from jose import JWTError, jwt

from config import settings


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


def create_access_token(
    data: dict, expires_delta: timedelta | None = None
) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    )
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def create_refresh_token(
    data: dict, expires_delta: timedelta | None = None
) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(days=settings.refresh_token_expire_days)
    )
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
        return payload
    except JWTError:
        return None
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/test_auth_service.py -v`
Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
cd c:\WORK\IIFF && git add backend/services/ backend/tests/test_auth_service.py && git commit -m "feat(backend): add auth service with JWT and bcrypt password hashing"
```

---

## Task 3: Auth Schemas (Pydantic)

**Files:**
- Create: `backend/schemas/__init__.py`
- Create: `backend/schemas/auth.py`

- [ ] **Step 1: Create schemas**

```python
# backend/schemas/__init__.py
```

```python
# backend/schemas/auth.py
from pydantic import BaseModel, EmailStr, field_validator
import re


class LocalRegisterRequest(BaseModel):
    username: str
    password: str
    email: str
    name: str
    nickname: str
    phone: str

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z0-9]{4,20}$", v):
            raise ValueError("아이디는 4~20자 영문+숫자만 가능합니다")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("비밀번호는 8자 이상이어야 합니다")
        if not re.search(r"[a-zA-Z]", v):
            raise ValueError("비밀번호에 영문자가 포함되어야 합니다")
        if not re.search(r"[0-9]", v):
            raise ValueError("비밀번호에 숫자가 포함되어야 합니다")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("비밀번호에 특수문자가 포함되어야 합니다")
        return v

    @field_validator("nickname")
    @classmethod
    def validate_nickname(cls, v: str) -> str:
        if len(v) < 2 or len(v) > 20:
            raise ValueError("닉네임은 2~20자여야 합니다")
        return v


class LocalLoginRequest(BaseModel):
    username: str
    password: str


class GoogleCallbackRequest(BaseModel):
    code: str


class GoogleProfileCompleteRequest(BaseModel):
    nickname: str
    phone: str

    @field_validator("nickname")
    @classmethod
    def validate_nickname(cls, v: str) -> str:
        if len(v) < 2 or len(v) > 20:
            raise ValueError("닉네임은 2~20자여야 합니다")
        return v


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    auth_provider: str
    email: str
    name: str
    nickname: str
    phone: str
    profile_image: str | None
    role: str
    status: str

    model_config = {"from_attributes": True}


class MessageResponse(BaseModel):
    message: str
    status: str | None = None
```

- [ ] **Step 2: Write schema validation tests**

```python
# backend/tests/test_auth_schemas.py
import pytest
from schemas.auth import LocalRegisterRequest


def test_valid_registration():
    data = LocalRegisterRequest(
        username="testuser",
        password="Test1234!",
        email="test@example.com",
        name="홍길동",
        nickname="길동이",
        phone="010-1234-5678",
    )
    assert data.username == "testuser"


def test_username_too_short():
    with pytest.raises(ValueError, match="4~20자"):
        LocalRegisterRequest(
            username="ab",
            password="Test1234!",
            email="test@example.com",
            name="홍길동",
            nickname="길동이",
            phone="010-1234-5678",
        )


def test_password_no_special_char():
    with pytest.raises(ValueError, match="특수문자"):
        LocalRegisterRequest(
            username="testuser",
            password="Test12345",
            email="test@example.com",
            name="홍길동",
            nickname="길동이",
            phone="010-1234-5678",
        )


def test_nickname_too_short():
    with pytest.raises(ValueError, match="2~20자"):
        LocalRegisterRequest(
            username="testuser",
            password="Test1234!",
            email="test@example.com",
            name="홍길동",
            nickname="길",
            phone="010-1234-5678",
        )
```

- [ ] **Step 3: Run tests**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/test_auth_schemas.py -v`
Expected: 4 passed.

- [ ] **Step 4: Commit**

```bash
cd c:\WORK\IIFF && git add backend/schemas/ backend/tests/test_auth_schemas.py && git commit -m "feat(backend): add auth Pydantic schemas with validation"
```

---

## Task 4: Auth Router — Local Registration + Login

**Files:**
- Create: `backend/routers/__init__.py`
- Create: `backend/routers/auth.py`
- Modify: `backend/main.py` — mount auth router
- Modify: `backend/deps.py` — add get_current_user
- Create: `backend/tests/test_auth_register.py`
- Create: `backend/tests/test_auth_login.py`

- [ ] **Step 1: Write registration tests**

```python
# backend/tests/test_auth_register.py
def test_register_local_user(client):
    response = client.post("/api/auth/register", json={
        "username": "newuser1",
        "password": "Pass1234!",
        "email": "new1@example.com",
        "name": "홍길동",
        "nickname": "길동이1",
        "phone": "010-1111-2222",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "회원가입이 완료되었습니다. 관리자 승인을 기다려주세요."
    assert data["status"] == "pending"


def test_register_duplicate_username(client):
    client.post("/api/auth/register", json={
        "username": "dupeuser",
        "password": "Pass1234!",
        "email": "dupe1@example.com",
        "name": "테스트1",
        "nickname": "듀프1",
        "phone": "010-0000-0001",
    })
    response = client.post("/api/auth/register", json={
        "username": "dupeuser",
        "password": "Pass1234!",
        "email": "dupe2@example.com",
        "name": "테스트2",
        "nickname": "듀프2",
        "phone": "010-0000-0002",
    })
    assert response.status_code == 409
    assert "아이디" in response.json()["detail"]


def test_register_duplicate_email(client):
    client.post("/api/auth/register", json={
        "username": "emailuser1",
        "password": "Pass1234!",
        "email": "same@example.com",
        "name": "테스트1",
        "nickname": "이메일1",
        "phone": "010-0000-0003",
    })
    response = client.post("/api/auth/register", json={
        "username": "emailuser2",
        "password": "Pass1234!",
        "email": "same@example.com",
        "name": "테스트2",
        "nickname": "이메일2",
        "phone": "010-0000-0004",
    })
    assert response.status_code == 409
    assert "이메일" in response.json()["detail"]


def test_register_invalid_password(client):
    response = client.post("/api/auth/register", json={
        "username": "badpwuser",
        "password": "short",
        "email": "badpw@example.com",
        "name": "테스트",
        "nickname": "배드비번",
        "phone": "010-0000-0005",
    })
    assert response.status_code == 422
```

- [ ] **Step 2: Write login tests**

```python
# backend/tests/test_auth_login.py
def test_login_success(client):
    # Register first
    client.post("/api/auth/register", json={
        "username": "loginuser",
        "password": "Pass1234!",
        "email": "login@example.com",
        "name": "로그인유저",
        "nickname": "로그인테스트",
        "phone": "010-3333-4444",
    })

    # Manually activate user for login test
    from tests.conftest import override_activate_user
    override_activate_user(client, "loginuser")

    response = client.post("/api/auth/login", json={
        "username": "loginuser",
        "password": "Pass1234!",
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={
        "username": "wrongpw",
        "password": "Pass1234!",
        "email": "wrongpw@example.com",
        "name": "테스트",
        "nickname": "틀린비번",
        "phone": "010-5555-6666",
    })

    from tests.conftest import override_activate_user
    override_activate_user(client, "wrongpw")

    response = client.post("/api/auth/login", json={
        "username": "wrongpw",
        "password": "WrongPass1!",
    })
    assert response.status_code == 401


def test_login_pending_user(client):
    client.post("/api/auth/register", json={
        "username": "pendinglogin",
        "password": "Pass1234!",
        "email": "pending@example.com",
        "name": "대기유저",
        "nickname": "대기중",
        "phone": "010-7777-8888",
    })
    response = client.post("/api/auth/login", json={
        "username": "pendinglogin",
        "password": "Pass1234!",
    })
    assert response.status_code == 403
    assert "승인" in response.json()["detail"]


def test_get_current_user(client):
    client.post("/api/auth/register", json={
        "username": "meuser",
        "password": "Pass1234!",
        "email": "me@example.com",
        "name": "내정보",
        "nickname": "미유저",
        "phone": "010-9999-0000",
    })

    from tests.conftest import override_activate_user
    override_activate_user(client, "meuser")

    login_resp = client.post("/api/auth/login", json={
        "username": "meuser",
        "password": "Pass1234!",
    })
    token = login_resp.json()["access_token"]

    response = client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "meuser"
    assert data["email"] == "me@example.com"
    assert data["role"] == "user"
    assert data["status"] == "active"
```

- [ ] **Step 3: Update conftest.py with helper for activating users**

Add to `backend/tests/conftest.py`:

```python
def override_activate_user(client, username: str):
    """Test helper: directly activate a user in the DB."""
    from sqlalchemy import text
    # Access the db_session from the override
    db = next(app.dependency_overrides[get_db]())
    db.execute(
        text("UPDATE users SET status = 'active' WHERE username = :username"),
        {"username": username},
    )
    db.commit()
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/test_auth_register.py tests/test_auth_login.py -v`
Expected: FAIL — router not found

- [ ] **Step 5: Create routers/__init__.py**

```python
# backend/routers/__init__.py
```

- [ ] **Step 6: Create auth router**

```python
# backend/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from deps import get_db, get_current_user
from models.user import User
from schemas.auth import (
    LocalRegisterRequest,
    LocalLoginRequest,
    TokenResponse,
    UserResponse,
    MessageResponse,
)
from services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def register_local(req: LocalRegisterRequest, db: Session = Depends(get_db)):
    # Check duplicate username
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=409, detail="이미 사용 중인 아이디입니다")

    # Check duplicate email
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=409, detail="이미 등록된 이메일입니다")

    # Check duplicate nickname
    if db.query(User).filter(User.nickname == req.nickname).first():
        raise HTTPException(status_code=409, detail="이미 사용 중인 닉네임입니다")

    user = User(
        auth_provider="local",
        username=req.username,
        password_hash=hash_password(req.password),
        email=req.email,
        name=req.name,
        nickname=req.nickname,
        phone=req.phone,
    )
    db.add(user)
    db.commit()

    return MessageResponse(
        message="회원가입이 완료되었습니다. 관리자 승인을 기다려주세요.",
        status="pending",
    )


@router.post("/login", response_model=TokenResponse)
def login_local(req: LocalLoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not user.password_hash:
        raise HTTPException(status_code=401, detail="아이디 또는 비밀번호가 올바르지 않습니다")

    if not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="아이디 또는 비밀번호가 올바르지 않습니다")

    # Status check
    if user.status == "pending":
        raise HTTPException(status_code=403, detail="관리자 승인을 기다리고 있습니다")
    if user.status == "rejected":
        raise HTTPException(status_code=403, detail="가입이 거부되었습니다")
    if user.status == "banned":
        raise HTTPException(status_code=403, detail="계정이 정지되었습니다")

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,  # True in production with HTTPS
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
    )

    return TokenResponse(access_token=access_token)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(
    response: Response,
    db: Session = Depends(get_db),
    refresh_token_cookie: str | None = None,
):
    from fastapi import Request

    # This will be called with cookie - handled via dependency
    pass  # Implemented in Step 7 below


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("refresh_token")
    return {"message": "로그아웃되었습니다"}
```

- [ ] **Step 7: Update the refresh endpoint properly**

Replace the placeholder `/refresh` endpoint:

```python
@router.post("/refresh", response_model=TokenResponse)
def refresh_access_token(request: Request, response: Response, db: Session = Depends(get_db)):
    from services.auth_service import decode_token

    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="리프레시 토큰이 없습니다")

    payload = decode_token(token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="유효하지 않은 리프레시 토큰입니다")

    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user or user.status != "active":
        raise HTTPException(status_code=401, detail="유효하지 않은 사용자입니다")

    new_access = create_access_token(data={"sub": str(user.id), "role": user.role})
    new_refresh = create_refresh_token(data={"sub": str(user.id)})

    response.set_cookie(
        key="refresh_token",
        value=new_refresh,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
    )

    return TokenResponse(access_token=new_access)
```

Add `from fastapi import Request` to the top imports of the file.

- [ ] **Step 8: Update deps.py with get_current_user**

```python
# backend/deps.py
from collections.abc import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from database import SessionLocal

security = HTTPBearer(auto_error=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
):
    from services.auth_service import decode_token
    from models.user import User

    if not credentials:
        raise HTTPException(status_code=401, detail="인증이 필요합니다")

    payload = decode_token(credentials.credentials)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다")

    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=401, detail="사용자를 찾을 수 없습니다")

    return user


def require_active(current_user=Depends(get_current_user)):
    if current_user.status != "active":
        raise HTTPException(status_code=403, detail="활성화된 계정이 필요합니다")
    return current_user


def require_admin(current_user=Depends(get_current_user)):
    if current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="관리자 권한이 필요합니다")
    return current_user
```

- [ ] **Step 9: Mount auth router in main.py**

Add to `backend/main.py`:

```python
from routers.auth import router as auth_router

app.include_router(auth_router)
```

- [ ] **Step 10: Run all tests**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/ -v`
Expected: All tests pass (health, database, user model, auth service, auth schemas, register, login).

- [ ] **Step 11: Commit**

```bash
cd c:\WORK\IIFF && git add backend/ && git commit -m "feat(backend): add auth router with local registration, login, JWT, and permissions"
```

---

## Task 5: Google OAuth Backend

**Files:**
- Modify: `backend/routers/auth.py` — add Google endpoints
- Create: `backend/tests/test_auth_google.py`

- [ ] **Step 1: Write Google OAuth tests (mocked)**

```python
# backend/tests/test_auth_google.py
from unittest.mock import patch


MOCK_GOOGLE_USER = {
    "sub": "google_test_123",
    "email": "googleuser@gmail.com",
    "name": "Google 사용자",
    "picture": "https://lh3.googleusercontent.com/photo.jpg",
}


def test_google_callback_new_user(client):
    with patch("routers.auth.exchange_google_code") as mock_exchange:
        mock_exchange.return_value = MOCK_GOOGLE_USER

        response = client.post("/api/auth/google/callback", json={
            "code": "fake_auth_code",
        })
        assert response.status_code == 200
        data = response.json()
        assert data["is_new"] is True
        assert data["needs_profile"] is True
        assert "temp_token" in data


def test_google_callback_existing_active_user(client):
    # First, create the user via callback
    with patch("routers.auth.exchange_google_code") as mock_exchange:
        mock_exchange.return_value = MOCK_GOOGLE_USER

        # First call — creates user
        resp1 = client.post("/api/auth/google/callback", json={"code": "fake"})
        temp_token = resp1.json()["temp_token"]

        # Complete profile
        client.post(
            "/api/auth/google/complete-profile",
            json={"nickname": "구글유저", "phone": "010-1111-0000"},
            headers={"Authorization": f"Bearer {temp_token}"},
        )

        # Activate user
        from tests.conftest import override_activate_user_by_email
        override_activate_user_by_email(client, "googleuser@gmail.com")

        # Second call — existing active user, should return access_token
        resp2 = client.post("/api/auth/google/callback", json={"code": "fake"})
        assert resp2.status_code == 200
        assert "access_token" in resp2.json()
```

- [ ] **Step 2: Add Google OAuth helper function**

Add to `backend/services/auth_service.py`:

```python
import httpx

async def exchange_google_code_for_user(code: str, client_id: str, client_secret: str, redirect_uri: str) -> dict:
    """Exchange Google auth code for user info."""
    async with httpx.AsyncClient() as http_client:
        # Exchange code for tokens
        token_resp = await http_client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": client_id,
                "client_secret": client_secret,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            },
        )
        tokens = token_resp.json()

        # Get user info
        userinfo_resp = await http_client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {tokens['access_token']}"},
        )
        return userinfo_resp.json()
```

- [ ] **Step 3: Add Google endpoints to auth router**

Add to `backend/routers/auth.py`:

```python
@router.post("/google/callback")
def google_callback(req: GoogleCallbackRequest, db: Session = Depends(get_db)):
    google_user = exchange_google_code(req.code)

    existing = db.query(User).filter(User.google_id == google_user["sub"]).first()

    if existing:
        if existing.status == "active":
            access_token = create_access_token(data={"sub": str(existing.id), "role": existing.role})
            return {"access_token": access_token, "token_type": "bearer", "is_new": False}
        if existing.status == "pending":
            if not existing.nickname or not existing.phone:
                temp_token = create_access_token(data={"sub": str(existing.id), "role": "user", "temp": True})
                return {"is_new": False, "needs_profile": True, "temp_token": temp_token}
            return {"message": "관리자 승인을 기다리고 있습니다", "status": "pending", "is_new": False}
        if existing.status == "rejected":
            raise HTTPException(status_code=403, detail="가입이 거부되었습니다")
        if existing.status == "banned":
            raise HTTPException(status_code=403, detail="계정이 정지되었습니다")

    # Check if email already exists (local signup with same email)
    email_exists = db.query(User).filter(User.email == google_user["email"]).first()
    if email_exists:
        raise HTTPException(status_code=409, detail="이미 일반 가입으로 등록된 이메일입니다")

    # New Google user
    user = User(
        auth_provider="google",
        google_id=google_user["sub"],
        email=google_user["email"],
        name=google_user.get("name", ""),
        nickname="",  # Must be filled in profile completion
        phone="",     # Must be filled in profile completion
        profile_image=google_user.get("picture"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    temp_token = create_access_token(data={"sub": str(user.id), "role": "user", "temp": True})
    return {"is_new": True, "needs_profile": True, "temp_token": temp_token}


@router.post("/google/complete-profile", response_model=MessageResponse)
def google_complete_profile(
    req: GoogleProfileCompleteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.auth_provider != "google":
        raise HTTPException(status_code=400, detail="Google 계정만 프로필 완성이 가능합니다")

    # Check duplicate nickname
    if db.query(User).filter(User.nickname == req.nickname, User.id != current_user.id).first():
        raise HTTPException(status_code=409, detail="이미 사용 중인 닉네임입니다")

    current_user.nickname = req.nickname
    current_user.phone = req.phone
    db.commit()

    return MessageResponse(
        message="프로필이 완성되었습니다. 관리자 승인을 기다려주세요.",
        status="pending",
    )
```

Add `exchange_google_code` function (synchronous wrapper for testing):

```python
def exchange_google_code(code: str) -> dict:
    """Synchronous Google code exchange — can be mocked in tests."""
    import httpx
    from config import settings

    resp = httpx.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "redirect_uri": "postmessage",
            "grant_type": "authorization_code",
        },
    )
    tokens = resp.json()

    userinfo = httpx.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {tokens['access_token']}"},
    )
    return userinfo.json()
```

Also add `GoogleCallbackRequest` and `GoogleProfileCompleteRequest` to the imports from schemas.

- [ ] **Step 4: Add conftest helper for activating by email**

Add to `backend/tests/conftest.py`:

```python
def override_activate_user_by_email(client, email: str):
    from sqlalchemy import text
    db = next(app.dependency_overrides[get_db]())
    db.execute(
        text("UPDATE users SET status = 'active' WHERE email = :email"),
        {"email": email},
    )
    db.commit()
```

- [ ] **Step 5: Run tests**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/test_auth_google.py -v`
Expected: All Google auth tests pass.

- [ ] **Step 6: Commit**

```bash
cd c:\WORK\IIFF && git add backend/ && git commit -m "feat(backend): add Google OAuth callback and profile completion endpoints"
```

---

## Task 6: Frontend — API Client + Auth Context

**Files:**
- Create: `frontend/src/services/api.ts`
- Create: `frontend/src/hooks/AuthContext.tsx`
- Create: `frontend/src/hooks/useAuth.ts`

- [ ] **Step 1: Create API client with interceptors**

```typescript
// frontend/src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Request interceptor: attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 with refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/")
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post("/api/auth/refresh", null, {
          withCredentials: true,
        });
        localStorage.setItem("access_token", data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

- [ ] **Step 2: Create AuthContext**

```tsx
// frontend/src/hooks/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/services/api";

interface User {
  id: number;
  auth_provider: string;
  email: string;
  name: string;
  nickname: string;
  phone: string;
  profile_image: string | null;
  role: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUser(null);
        return;
      }
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch {
      setUser(null);
      localStorage.removeItem("access_token");
    }
  };

  const login = async (token: string) => {
    localStorage.setItem("access_token", token);
    await refreshUser();
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem("access_token");
    setUser(null);
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

- [ ] **Step 3: Create ProtectedRoute**

```tsx
// frontend/src/components/auth/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";

interface Props {
  children: React.ReactNode;
  requireActive?: boolean;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireActive = true, requireAdmin = false }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireActive && user.status !== "active") {
    return <Navigate to="/pending" replace />;
  }

  if (requireAdmin && !["admin", "superadmin"].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

- [ ] **Step 4: Commit**

```bash
cd c:\WORK\IIFF && git add frontend/src/services/ frontend/src/hooks/ frontend/src/components/auth/ && git commit -m "feat(frontend): add API client, auth context, and protected routes"
```

---

## Task 7: Frontend — Auth Pages (Login, Register, Pending)

**Files:**
- Create: `frontend/src/pages/Auth/LoginPage.tsx`
- Create: `frontend/src/pages/Auth/RegisterPage.tsx`
- Create: `frontend/src/pages/Auth/PendingPage.tsx`
- Create: `frontend/src/pages/Auth/ProfileCompletePage.tsx`
- Modify: `frontend/src/App.tsx` — add auth routes
- Modify: `frontend/src/main.tsx` — wrap with AuthProvider

- [ ] **Step 1: Create LoginPage**

```tsx
// frontend/src/pages/Auth/LoginPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";
import api from "@/services/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/login", { username, password });
      await login(data.access_token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "로그인에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="heading-display text-3xl text-gold text-center mb-8">로그인</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-gold)] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-gold)] focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[var(--color-gold)] text-black font-semibold rounded-lg hover:bg-[var(--color-gold-light)] transition disabled:opacity-50"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-sm text-gray-500">또는</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          onClick={() => {/* Google OAuth will be wired in integration */}}
          className="w-full py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google로 로그인
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          계정이 없으신가요? <Link to="/register" className="text-gold hover:underline">회원가입</Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create RegisterPage**

```tsx
// frontend/src/pages/Auth/RegisterPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/services/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "", password: "", passwordConfirm: "",
    email: "", name: "", nickname: "", phone: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/register", {
        username: form.username,
        password: form.password,
        email: form.email,
        name: form.name,
        nickname: form.nickname,
        phone: form.phone,
      });
      navigate("/pending");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map((d: any) => d.msg).join(", "));
      } else {
        setError("회원가입에 실패했습니다");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { key: "name", label: "실명", type: "text", placeholder: "홍길동" },
    { key: "username", label: "아이디", type: "text", placeholder: "4~20자 영문+숫자" },
    { key: "email", label: "이메일", type: "email", placeholder: "example@email.com" },
    { key: "password", label: "비밀번호", type: "password", placeholder: "8자 이상, 영문+숫자+특수문자" },
    { key: "passwordConfirm", label: "비밀번호 확인", type: "password", placeholder: "비밀번호 재입력" },
    { key: "nickname", label: "닉네임", type: "text", placeholder: "2~20자" },
    { key: "phone", label: "전화번호", type: "tel", placeholder: "010-1234-5678" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="heading-display text-3xl text-gold text-center mb-8">회원가입</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm text-gray-400 mb-1">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => updateField(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[var(--color-gold)] text-black font-semibold rounded-lg hover:bg-[var(--color-gold-light)] transition disabled:opacity-50"
          >
            {isLoading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          이미 계정이 있으신가요? <Link to="/login" className="text-gold hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create PendingPage**

```tsx
// frontend/src/pages/Auth/PendingPage.tsx
import { Link } from "react-router-dom";

export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md text-center">
        <div className="text-6xl mb-6">⏳</div>
        <h1 className="heading-display text-2xl text-gold mb-4">승인 대기 중</h1>
        <p className="text-gray-400 mb-6">
          회원가입이 완료되었습니다.<br />
          관리자가 승인하면 서비스를 이용하실 수 있습니다.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create ProfileCompletePage (for Google OAuth)**

```tsx
// frontend/src/pages/Auth/ProfileCompletePage.tsx
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/services/api";

export default function ProfileCompletePage() {
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const tempToken = searchParams.get("token");

    try {
      await api.post(
        "/auth/google/complete-profile",
        { nickname, phone },
        { headers: { Authorization: `Bearer ${tempToken}` } }
      );
      navigate("/pending");
    } catch (err: any) {
      setError(err.response?.data?.detail || "프로필 저장에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="heading-display text-2xl text-gold text-center mb-2">프로필 완성</h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Google 계정으로 가입하셨습니다. 추가 정보를 입력해주세요.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="2~20자"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">전화번호</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-[var(--color-gold)] focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[var(--color-gold)] text-black font-semibold rounded-lg hover:bg-[var(--color-gold-light)] transition disabled:opacity-50"
          >
            {isLoading ? "저장 중..." : "프로필 완성"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Update App.tsx with auth routes**

```tsx
// frontend/src/App.tsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/pages/Home/HomePage";
import PresentationPage from "@/pages/Presentation/PresentationPage";
import DocsPage from "@/pages/Docs/DocsPage";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import PendingPage from "@/pages/Auth/PendingPage";
import ProfileCompletePage from "@/pages/Auth/ProfileCompletePage";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/pending" element={<PendingPage />} />
      <Route path="/complete-profile" element={<ProfileCompletePage />} />

      {/* Main site routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/presentation" element={<PresentationPage />} />
        <Route path="/docs" element={<DocsPage />} />
      </Route>
    </Routes>
  );
}
```

- [ ] **Step 6: Update main.tsx with AuthProvider**

```tsx
// frontend/src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/hooks/AuthContext";
import App from "./App";
import "./i18n";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
```

- [ ] **Step 7: Verify TypeScript compilation**

Run: `cd c:\WORK\IIFF/frontend && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 8: Verify pages render**

Run: `cd c:\WORK\IIFF/frontend && npm run dev`
Check: `/login`, `/register`, `/pending`, `/complete-profile` all render correctly with IIFF dark theme and gold accents.

- [ ] **Step 9: Commit**

```bash
cd c:\WORK\IIFF && git add frontend/ && git commit -m "feat(frontend): add auth pages (login, register, pending, profile complete) with routing"
```

---

## Task 8: Seed SuperAdmin Script

**Files:**
- Create: `backend/scripts/seed_admin.py`

- [ ] **Step 1: Create seed script**

```python
# backend/scripts/seed_admin.py
"""Create initial SuperAdmin user. Run once after first migration."""
import sys
sys.path.insert(0, ".")

from database import SessionLocal
from models.user import User
from services.auth_service import hash_password


def seed_admin():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.role == "superadmin").first()
        if existing:
            print(f"SuperAdmin already exists: {existing.username} ({existing.email})")
            return

        admin = User(
            auth_provider="local",
            username="admin",
            password_hash=hash_password("Admin1234!"),
            email="admin@iiff.twinverse.org",
            name="관리자",
            nickname="IIFF관리자",
            phone="000-0000-0000",
            role="superadmin",
            status="active",
        )
        db.add(admin)
        db.commit()
        print("SuperAdmin created successfully:")
        print(f"  Username: admin")
        print(f"  Password: Admin1234!")
        print(f"  Email: admin@iiff.twinverse.org")
        print("  ⚠️  Change the password after first login!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()
```

- [ ] **Step 2: Run seed script**

Run:
```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python scripts/seed_admin.py
```
Expected: `SuperAdmin created successfully`

- [ ] **Step 3: Verify in database**

Run:
```bash
docker compose exec postgres psql -U iiff_user -d iiff_db -c "SELECT id, username, email, role, status FROM users;"
```
Expected: Shows admin user with role=superadmin, status=active.

- [ ] **Step 4: Commit**

```bash
cd c:\WORK\IIFF && git add backend/scripts/ && git commit -m "feat(backend): add SuperAdmin seed script"
```

---

## Task 9: Full Integration Test

**Files:** None (verification only)

- [ ] **Step 1: Run all backend tests**

```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/ -v
```
Expected: All tests pass (health, database, user model, auth service, auth schemas, auth register, auth login, auth google).

- [ ] **Step 2: Start backend and test registration flow**

Start: `cd c:\WORK\IIFF/backend && .venv/Scripts/uvicorn main:app --port 8000 --reload`

Test local registration:
```bash
curl -X POST http://localhost:8000/api/auth/register -H "Content-Type: application/json" -d '{"username":"testuser","password":"Test1234!","email":"test@test.com","name":"테스트","nickname":"테스터","phone":"010-0000-0000"}'
```
Expected: 201, pending message

Test login (should fail — pending):
```bash
curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d '{"username":"testuser","password":"Test1234!"}'
```
Expected: 403, 승인 대기

Test admin login:
```bash
curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"Admin1234!"}'
```
Expected: 200, access_token returned

- [ ] **Step 3: Test frontend pages**

Start: `cd c:\WORK\IIFF/frontend && npm run dev`

Verify:
- [ ] `/login` — renders login form with IIFF design
- [ ] `/register` — renders registration form with all fields
- [ ] `/pending` — renders approval waiting screen
- [ ] `/` — still shows full presentation
- [ ] Login with admin/Admin1234! works and redirects to home

- [ ] **Step 4: Frontend build check**

```bash
cd c:\WORK\IIFF/frontend && npm run build
```
Expected: Build succeeds.

- [ ] **Step 5: Final commit**

```bash
cd c:\WORK\IIFF && git add -A && git commit -m "feat: complete Phase 2 — authentication system with dual signup and admin approval"
```

---

## Summary

After Phase 2 completion:
- User model with dual auth (local + Google OAuth)
- Alembic migration applied to PostgreSQL
- Auth service: bcrypt password hashing, JWT access/refresh tokens
- Pydantic schemas with Korean validation messages
- Auth router: register, login, Google callback, profile complete, refresh, logout, me
- Permission dependencies: get_current_user, require_active, require_admin
- Frontend: API client with token interceptors
- Frontend: AuthContext with user state management
- Frontend: Login, Register, Pending, ProfileComplete pages
- Frontend: ProtectedRoute component
- SuperAdmin seed script
- All backend tests passing

**Next:** Phase 3 — Board System (6종 게시판 + 파일 업로드)
