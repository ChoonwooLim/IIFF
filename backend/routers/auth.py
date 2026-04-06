from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from deps import get_db, get_current_user
from models.user import User
from schemas.auth import (
    LocalRegisterRequest,
    LocalLoginRequest,
    TokenResponse,
    UserResponse,
    MessageResponse,
    GoogleCallbackRequest,
    GoogleProfileCompleteRequest,
)
from services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


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


@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def register_local(req: LocalRegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=409, detail="이미 사용 중인 아이디입니다")
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=409, detail="이미 등록된 이메일입니다")
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
    return MessageResponse(message="회원가입이 완료되었습니다. 관리자 승인을 기다려주세요.", status="pending")


@router.post("/login", response_model=TokenResponse)
def login_local(req: LocalLoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not user.password_hash:
        raise HTTPException(status_code=401, detail="아이디 또는 비밀번호가 올바르지 않습니다")
    if not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="아이디 또는 비밀번호가 올바르지 않습니다")
    if user.status == "pending":
        raise HTTPException(status_code=403, detail="관리자 승인을 기다리고 있습니다")
    if user.status == "rejected":
        raise HTTPException(status_code=403, detail="가입이 거부되었습니다")
    if user.status == "banned":
        raise HTTPException(status_code=403, detail="계정이 정지되었습니다")

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    response.set_cookie(
        key="refresh_token", value=refresh_token, httponly=True,
        secure=False, samesite="lax", max_age=7 * 24 * 60 * 60,
    )
    return TokenResponse(access_token=access_token)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/refresh", response_model=TokenResponse)
def refresh_access_token(request: Request, response: Response, db: Session = Depends(get_db)):
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
        key="refresh_token", value=new_refresh, httponly=True,
        secure=False, samesite="lax", max_age=7 * 24 * 60 * 60,
    )
    return TokenResponse(access_token=new_access)


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("refresh_token")
    return {"message": "로그아웃되었습니다"}


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
        nickname="",
        phone="",
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
    if db.query(User).filter(User.nickname == req.nickname, User.id != current_user.id).first():
        raise HTTPException(status_code=409, detail="이미 사용 중인 닉네임입니다")
    current_user.nickname = req.nickname
    current_user.phone = req.phone
    db.commit()
    return MessageResponse(message="프로필이 완성되었습니다. 관리자 승인을 기다려주세요.", status="pending")
