from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timezone

from deps import get_db, require_admin
from models.user import User
from models.post import Post
from models.comment import Comment
from models.board import Board
from models.meeting import Meeting
from models.meeting_participant import MeetingParticipant
from schemas.admin import UserStatusUpdate, UserRoleUpdate, DashboardStats

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return DashboardStats(
        total_users=db.query(User).count(),
        pending_users=db.query(User).filter(User.status == "pending").count(),
        active_users=db.query(User).filter(User.status == "active").count(),
        total_posts=db.query(Post).count(),
        hidden_posts=db.query(Post).filter(Post.is_hidden == True).count(),
        active_meetings=db.query(Meeting).filter(Meeting.status == "active").count(),
    )


@router.get("/users")
def list_users(
    status_filter: str | None = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    query = db.query(User)
    if status_filter:
        query = query.filter(User.status == status_filter)
    total = query.count()
    users = query.order_by(User.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    return {
        "users": [
            {
                "id": u.id, "auth_provider": u.auth_provider, "username": u.username,
                "email": u.email, "name": u.name, "nickname": u.nickname, "phone": u.phone,
                "profile_image": u.profile_image, "role": u.role, "status": u.status,
                "created_at": u.created_at.isoformat() if u.created_at else None,
                "updated_at": u.updated_at.isoformat() if u.updated_at else None,
            }
            for u in users
        ],
        "total": total, "page": page, "per_page": per_page,
    }


@router.patch("/users/{user_id}/status")
def update_user_status(user_id: int, req: UserStatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다")
    if user.role == "superadmin":
        raise HTTPException(status_code=403, detail="슈퍼관리자의 상태는 변경할 수 없습니다")
    user.status = req.status
    db.commit()
    return {"message": f"사용자 상태가 {req.status}(으)로 변경되었습니다"}


@router.patch("/users/{user_id}/role")
def update_user_role(user_id: int, req: UserRoleUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다")
    if user.role == "superadmin":
        raise HTTPException(status_code=403, detail="슈퍼관리자의 역할은 변경할 수 없습니다")
    if current_user.role != "superadmin":
        raise HTTPException(status_code=403, detail="역할 변경은 슈퍼관리자만 가능합니다")
    user.role = req.role
    db.commit()
    return {"message": f"사용자 역할이 {req.role}(으)로 변경되었습니다"}


@router.get("/posts")
def list_posts_admin(
    hidden_only: bool = False,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    query = db.query(Post).options(joinedload(Post.board), joinedload(Post.user))
    if hidden_only:
        query = query.filter(Post.is_hidden == True)
    total = query.count()
    posts = query.order_by(Post.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    return {
        "posts": [
            {
                "id": p.id, "title": p.title,
                "board_name": p.board.name if p.board else "",
                "author_nickname": p.user.nickname if p.user else "",
                "is_hidden": p.is_hidden, "view_count": p.view_count,
                "created_at": p.created_at.isoformat() if p.created_at else None,
            }
            for p in posts
        ],
        "total": total, "page": page, "per_page": per_page,
    }


@router.patch("/posts/{post_id}/hide")
def toggle_post_visibility(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    post.is_hidden = not post.is_hidden
    db.commit()
    return {"message": f"게시글이 {'숨김' if post.is_hidden else '공개'} 처리되었습니다", "is_hidden": post.is_hidden}


@router.delete("/posts/{post_id}")
def delete_post_admin(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    db.delete(post)
    db.commit()
    return {"message": "게시글이 삭제되었습니다"}


@router.get("/meetings")
def list_meetings_admin(
    status_filter: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    query = db.query(Meeting).options(joinedload(Meeting.creator), joinedload(Meeting.participants))
    if status_filter:
        query = query.filter(Meeting.status == status_filter)
    meetings = query.order_by(Meeting.created_at.desc()).all()
    return [
        {
            "id": m.id, "name": m.name, "type": m.type, "status": m.status,
            "creator_nickname": m.creator.nickname if m.creator else "",
            "participant_count": len([p for p in m.participants if p.left_at is None]),
            "created_at": m.created_at.isoformat() if m.created_at else None,
        }
        for m in meetings
    ]


@router.post("/meetings/{meeting_id}/close")
def close_meeting_admin(meeting_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="회의실을 찾을 수 없습니다")
    if meeting.status == "closed":
        return {"message": "이미 종료된 회의실입니다"}
    meeting.status = "closed"
    meeting.closed_at = datetime.now(timezone.utc)
    db.query(MeetingParticipant).filter(
        MeetingParticipant.meeting_id == meeting_id, MeetingParticipant.left_at == None,
    ).update({"left_at": datetime.now(timezone.utc)})
    db.commit()
    return {"message": "회의가 종료되었습니다"}
