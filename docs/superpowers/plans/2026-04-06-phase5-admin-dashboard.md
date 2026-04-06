# Phase 5: Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Admin dashboard with user management (approve/reject/ban, role changes), post/comment moderation (hide/delete), and meeting management (close/delete) — accessible only to admin/superadmin users.

**Architecture:** Single backend admin router with role-gated endpoints. Frontend admin pages under `/admin/*` route group, protected by `requireAdmin`. Separate AdminLayout component with sidebar navigation. Reuses existing models — no new DB tables needed.

**Tech Stack:** FastAPI, SQLAlchemy 2.0, React 19, TypeScript, Tailwind CSS 4

---

## File Structure

### Backend — New/Modified Files

```
backend/
├── routers/
│   └── admin.py                  # Admin CRUD endpoints
├── schemas/
│   └── admin.py                  # Admin request/response schemas
├── main.py                       # (modify) mount admin router
└── tests/
    └── test_admin.py             # Admin endpoint tests
```

### Frontend — New Files

```
frontend/src/
├── components/
│   └── admin/
│       └── AdminLayout.tsx       # Sidebar + content layout for admin
├── pages/
│   └── Admin/
│       ├── AdminDashboardPage.tsx # Overview stats
│       ├── UserManagementPage.tsx # User list + actions
│       ├── PostModerationPage.tsx # Post/comment moderation
│       └── MeetingManagementPage.tsx # Meeting oversight
└── App.tsx                       # (modify) add admin routes
```

---

## Task 1: Admin Backend — Schemas + Router

**Files:**
- Create: `backend/schemas/admin.py`
- Create: `backend/routers/admin.py`
- Modify: `backend/main.py`
- Create: `backend/tests/test_admin.py`

- [ ] **Step 1: Create admin schemas**

```python
# backend/schemas/admin.py
from pydantic import BaseModel, field_validator


class UserStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in ("active", "rejected", "banned"):
            raise ValueError("상태는 active, rejected, banned 중 하나여야 합니다")
        return v


class UserRoleUpdate(BaseModel):
    role: str

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in ("user", "admin"):
            raise ValueError("역할은 user 또는 admin이어야 합니다")
        return v


class AdminUserResponse(BaseModel):
    id: int
    auth_provider: str
    username: str | None
    email: str
    name: str
    nickname: str
    phone: str
    profile_image: str | None
    role: str
    status: str
    created_at: str
    updated_at: str
    model_config = {"from_attributes": True}


class AdminPostResponse(BaseModel):
    id: int
    title: str
    board_name: str
    author_nickname: str
    is_hidden: bool
    view_count: int
    created_at: str
    model_config = {"from_attributes": True}


class AdminMeetingResponse(BaseModel):
    id: int
    name: str
    type: str
    status: str
    creator_nickname: str
    participant_count: int
    created_at: str
    model_config = {"from_attributes": True}


class DashboardStats(BaseModel):
    total_users: int
    pending_users: int
    active_users: int
    total_posts: int
    hidden_posts: int
    active_meetings: int
```

- [ ] **Step 2: Create admin router**

```python
# backend/routers/admin.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from deps import get_db, require_admin
from models.user import User
from models.post import Post
from models.comment import Comment
from models.board import Board
from models.meeting import Meeting
from models.meeting_participant import MeetingParticipant
from schemas.admin import (
    UserStatusUpdate,
    UserRoleUpdate,
    DashboardStats,
)
from datetime import datetime, timezone

router = APIRouter(prefix="/api/admin", tags=["admin"])


# ── Dashboard Stats ──────────────────────────────────────

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    total_users = db.query(User).count()
    pending_users = db.query(User).filter(User.status == "pending").count()
    active_users = db.query(User).filter(User.status == "active").count()
    total_posts = db.query(Post).count()
    hidden_posts = db.query(Post).filter(Post.is_hidden == True).count()
    active_meetings = db.query(Meeting).filter(Meeting.status == "active").count()

    return DashboardStats(
        total_users=total_users,
        pending_users=pending_users,
        active_users=active_users,
        total_posts=total_posts,
        hidden_posts=hidden_posts,
        active_meetings=active_meetings,
    )


# ── User Management ──────────────────────────────────────

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
                "id": u.id,
                "auth_provider": u.auth_provider,
                "username": u.username,
                "email": u.email,
                "name": u.name,
                "nickname": u.nickname,
                "phone": u.phone,
                "profile_image": u.profile_image,
                "role": u.role,
                "status": u.status,
                "created_at": u.created_at.isoformat() if u.created_at else None,
                "updated_at": u.updated_at.isoformat() if u.updated_at else None,
            }
            for u in users
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
    }


@router.patch("/users/{user_id}/status")
def update_user_status(
    user_id: int,
    req: UserStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다")
    if user.role == "superadmin":
        raise HTTPException(status_code=403, detail="슈퍼관리자의 상태는 변경할 수 없습니다")
    user.status = req.status
    db.commit()
    return {"message": f"사용자 상태가 {req.status}(으)로 변경되었습니다"}


@router.patch("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    req: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
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


# ── Post Moderation ──────────────────────────────────────

@router.get("/posts")
def list_posts_admin(
    hidden_only: bool = False,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    query = db.query(Post).options(
        joinedload(Post.board), joinedload(Post.user)
    )
    if hidden_only:
        query = query.filter(Post.is_hidden == True)
    total = query.count()
    posts = query.order_by(Post.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "posts": [
            {
                "id": p.id,
                "title": p.title,
                "board_name": p.board.name if p.board else "",
                "author_nickname": p.user.nickname if p.user else "",
                "is_hidden": p.is_hidden,
                "view_count": p.view_count,
                "created_at": p.created_at.isoformat() if p.created_at else None,
            }
            for p in posts
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
    }


@router.patch("/posts/{post_id}/hide")
def toggle_post_visibility(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    post.is_hidden = not post.is_hidden
    db.commit()
    status = "숨김" if post.is_hidden else "공개"
    return {"message": f"게시글이 {status} 처리되었습니다", "is_hidden": post.is_hidden}


@router.delete("/posts/{post_id}")
def delete_post_admin(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    db.delete(post)
    db.commit()
    return {"message": "게시글이 삭제되었습니다"}


# ── Meeting Management ───────────────────────────────────

@router.get("/meetings")
def list_meetings_admin(
    status_filter: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    query = db.query(Meeting).options(
        joinedload(Meeting.creator), joinedload(Meeting.participants)
    )
    if status_filter:
        query = query.filter(Meeting.status == status_filter)
    meetings = query.order_by(Meeting.created_at.desc()).all()

    return [
        {
            "id": m.id,
            "name": m.name,
            "type": m.type,
            "status": m.status,
            "creator_nickname": m.creator.nickname if m.creator else "",
            "participant_count": len([p for p in m.participants if p.left_at is None]),
            "created_at": m.created_at.isoformat() if m.created_at else None,
        }
        for m in meetings
    ]


@router.post("/meetings/{meeting_id}/close")
def close_meeting_admin(
    meeting_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="회의실을 찾을 수 없습니다")
    if meeting.status == "closed":
        return {"message": "이미 종료된 회의실입니다"}
    meeting.status = "closed"
    meeting.closed_at = datetime.now(timezone.utc)
    db.query(MeetingParticipant).filter(
        MeetingParticipant.meeting_id == meeting_id,
        MeetingParticipant.left_at == None,
    ).update({"left_at": datetime.now(timezone.utc)})
    db.commit()
    return {"message": "회의가 종료되었습니다"}
```

- [ ] **Step 3: Mount admin router in main.py**

Add after the chat router:
```python
from routers.admin import router as admin_router
app.include_router(admin_router)
```

- [ ] **Step 4: Write admin tests**

```python
# backend/tests/test_admin.py

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
    """Promote a user to admin directly in the DB."""
    from sqlalchemy import text
    from main import app
    from deps import get_db
    db = next(app.dependency_overrides[get_db]())
    db.execute(
        text("UPDATE users SET role = 'admin' WHERE username = :username"),
        {"username": username},
    )
    db.commit()


def _make_superadmin(client, username):
    """Promote a user to superadmin directly in the DB."""
    from sqlalchemy import text
    from main import app
    from deps import get_db
    db = next(app.dependency_overrides[get_db]())
    db.execute(
        text("UPDATE users SET role = 'superadmin' WHERE username = :username"),
        {"username": username},
    )
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
    # Create target user
    client.post("/api/auth/register", json={
        "username": "target1", "password": "Pass1234!",
        "email": "target1@test.com", "name": "대상유저",
        "nickname": "대상유저1", "phone": "010-1111-1111",
    })
    from tests.conftest import override_activate_user
    override_activate_user(client, "target1")

    # Create admin
    token = _register_and_activate(client, "adminmod1", "adminmod1@test.com", "관리자변경1")
    _make_admin(client, "adminmod1")

    # Get target user id
    users_resp = client.get("/api/admin/users", headers={"Authorization": f"Bearer {token}"})
    target = [u for u in users_resp.json()["users"] if u["username"] == "target1"][0]

    # Ban the user
    resp = client.patch(
        f"/api/admin/users/{target['id']}/status",
        json={"status": "banned"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200


def test_only_superadmin_can_change_role(client):
    # Create target user
    token_target = _register_and_activate(client, "roletarget1", "roletarget1@test.com", "역할대상1")

    # Create admin (not superadmin)
    token_admin = _register_and_activate(client, "roleadmin1", "roleadmin1@test.com", "역할관리자1")
    _make_admin(client, "roleadmin1")

    # Get target id
    users_resp = client.get("/api/admin/users", headers={"Authorization": f"Bearer {token_admin}"})
    target = [u for u in users_resp.json()["users"] if u["username"] == "roletarget1"][0]

    # Admin cannot change role
    resp = client.patch(
        f"/api/admin/users/{target['id']}/role",
        json={"role": "admin"},
        headers={"Authorization": f"Bearer {token_admin}"},
    )
    assert resp.status_code == 403

    # Superadmin can
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

    # Create a post on general board
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

    # Create post via API
    resp = client.post(
        "/api/posts",
        data={"title": "테스트 게시글", "content": "내용입니다", "board_id": str(board.id)},
        headers={"Authorization": f"Bearer {token}"},
    )
    post_id = resp.json()["id"]

    # Hide post
    hide_resp = client.patch(
        f"/api/admin/posts/{post_id}/hide",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert hide_resp.status_code == 200
    assert hide_resp.json()["is_hidden"] is True

    # Unhide post
    unhide_resp = client.patch(
        f"/api/admin/posts/{post_id}/hide",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert unhide_resp.status_code == 200
    assert unhide_resp.json()["is_hidden"] is False
```

- [ ] **Step 5: Run tests**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/test_admin.py -v`
Expected: 7 passed.

- [ ] **Step 6: Run all tests**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/ -v`

- [ ] **Step 7: Commit**

```bash
cd c:\WORK\IIFF && git add backend/schemas/admin.py backend/routers/admin.py backend/main.py backend/tests/test_admin.py && git commit -m "feat(backend): add admin dashboard API with user/post/meeting management"
```

---

## Task 2: Frontend — AdminLayout Component

**Files:**
- Create: `frontend/src/components/admin/AdminLayout.tsx`

- [ ] **Step 1: Create AdminLayout**

```tsx
// frontend/src/components/admin/AdminLayout.tsx
import { NavLink, Outlet } from "react-router-dom";

const ADMIN_NAV = [
  { label: "대시보드", path: "/admin" },
  { label: "회원 관리", path: "/admin/users" },
  { label: "게시글 관리", path: "/admin/posts" },
  { label: "회의실 관리", path: "/admin/meetings" },
];

export default function AdminLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6 min-h-[calc(100vh-120px)]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 hidden md:block">
        <h2 className="text-lg font-bold text-[var(--color-gold)] mb-6">관리자</h2>
        <nav className="space-y-1">
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)] font-semibold"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd c:\WORK\IIFF && git add frontend/src/components/admin/AdminLayout.tsx && git commit -m "feat(frontend): add AdminLayout with sidebar navigation"
```

---

## Task 3: Frontend — Admin Dashboard Page

**Files:**
- Create: `frontend/src/pages/Admin/AdminDashboardPage.tsx`

- [ ] **Step 1: Create AdminDashboardPage**

```tsx
// frontend/src/pages/Admin/AdminDashboardPage.tsx
import { useState, useEffect } from "react";
import api from "@/services/api";

interface Stats {
  total_users: number;
  pending_users: number;
  active_users: number;
  total_posts: number;
  hidden_posts: number;
  active_meetings: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get("/admin/stats").then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <div className="text-gray-400 py-12 text-center">로딩 중...</div>;

  const cards = [
    { label: "전체 회원", value: stats.total_users, color: "text-white" },
    { label: "승인 대기", value: stats.pending_users, color: "text-yellow-400" },
    { label: "활성 회원", value: stats.active_users, color: "text-green-400" },
    { label: "전체 게시글", value: stats.total_posts, color: "text-white" },
    { label: "숨김 게시글", value: stats.hidden_posts, color: "text-red-400" },
    { label: "활성 회의실", value: stats.active_meetings, color: "text-blue-400" },
  ];

  return (
    <div>
      <h1 className="heading-display text-2xl text-gold mb-8">대시보드</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="glass-card p-6">
            <p className="text-sm text-gray-400 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd c:\WORK\IIFF && git add frontend/src/pages/Admin/AdminDashboardPage.tsx && git commit -m "feat(frontend): add admin dashboard page with stats overview"
```

---

## Task 4: Frontend — User Management Page

**Files:**
- Create: `frontend/src/pages/Admin/UserManagementPage.tsx`

- [ ] **Step 1: Create UserManagementPage**

```tsx
// frontend/src/pages/Admin/UserManagementPage.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";
import api from "@/services/api";

interface UserItem {
  id: number;
  auth_provider: string;
  username: string | null;
  email: string;
  name: string;
  nickname: string;
  role: string;
  status: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "대기",
  active: "활성",
  rejected: "거절",
  banned: "차단",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  active: "bg-green-500/20 text-green-400",
  rejected: "bg-gray-500/20 text-gray-400",
  banned: "bg-red-500/20 text-red-400",
};

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchUsers = () => {
    const params: Record<string, string | number> = { page, per_page: 20 };
    if (statusFilter) params.status_filter = statusFilter;
    api.get("/admin/users", { params }).then(({ data }) => {
      setUsers(data.users);
      setTotal(data.total);
    });
  };

  useEffect(() => { fetchUsers(); }, [page, statusFilter]);

  const updateStatus = async (userId: number, status: string) => {
    await api.patch(`/admin/users/${userId}/status`, { status });
    fetchUsers();
  };

  const updateRole = async (userId: number, role: string) => {
    await api.patch(`/admin/users/${userId}/role`, { role });
    fetchUsers();
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h1 className="heading-display text-2xl text-gold mb-6">회원 관리</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["", "pending", "active", "rejected", "banned"].map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              statusFilter === s ? "bg-[var(--color-gold)] text-black font-semibold" : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}>
            {s === "" ? "전체" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-white/10">
              <th className="py-3 px-2">닉네임</th>
              <th className="py-3 px-2">이메일</th>
              <th className="py-3 px-2">인증</th>
              <th className="py-3 px-2">역할</th>
              <th className="py-3 px-2">상태</th>
              <th className="py-3 px-2">가입일</th>
              <th className="py-3 px-2">액션</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-2 text-white">{u.nickname}</td>
                <td className="py-3 px-2 text-gray-400">{u.email}</td>
                <td className="py-3 px-2 text-gray-400">{u.auth_provider}</td>
                <td className="py-3 px-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300">{u.role}</span>
                </td>
                <td className="py-3 px-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[u.status] || ""}`}>
                    {STATUS_LABELS[u.status] || u.status}
                  </span>
                </td>
                <td className="py-3 px-2 text-gray-500">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString("ko-KR") : ""}
                </td>
                <td className="py-3 px-2">
                  <div className="flex gap-1 flex-wrap">
                    {u.status === "pending" && (
                      <>
                        <button onClick={() => updateStatus(u.id, "active")}
                          className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">승인</button>
                        <button onClick={() => updateStatus(u.id, "rejected")}
                          className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">거절</button>
                      </>
                    )}
                    {u.status === "active" && u.role !== "superadmin" && (
                      <button onClick={() => updateStatus(u.id, "banned")}
                        className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">차단</button>
                    )}
                    {u.status === "banned" && (
                      <button onClick={() => updateStatus(u.id, "active")}
                        className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">해제</button>
                    )}
                    {currentUser?.role === "superadmin" && u.role !== "superadmin" && (
                      <button onClick={() => updateRole(u.id, u.role === "admin" ? "user" : "admin")}
                        className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30">
                        {u.role === "admin" ? "관리자 해제" : "관리자 지정"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded text-sm ${
                p === page ? "bg-[var(--color-gold)] text-black" : "bg-white/5 text-gray-400"
              }`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd c:\WORK\IIFF && git add frontend/src/pages/Admin/UserManagementPage.tsx && git commit -m "feat(frontend): add user management page with status/role actions"
```

---

## Task 5: Frontend — Post Moderation + Meeting Management Pages

**Files:**
- Create: `frontend/src/pages/Admin/PostModerationPage.tsx`
- Create: `frontend/src/pages/Admin/MeetingManagementPage.tsx`

- [ ] **Step 1: Create PostModerationPage**

```tsx
// frontend/src/pages/Admin/PostModerationPage.tsx
import { useState, useEffect } from "react";
import api from "@/services/api";

interface PostItem {
  id: number;
  title: string;
  board_name: string;
  author_nickname: string;
  is_hidden: boolean;
  view_count: number;
  created_at: string;
}

export default function PostModerationPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hiddenOnly, setHiddenOnly] = useState(false);

  const fetchPosts = () => {
    api.get("/admin/posts", { params: { page, per_page: 20, hidden_only: hiddenOnly } })
      .then(({ data }) => { setPosts(data.posts); setTotal(data.total); });
  };

  useEffect(() => { fetchPosts(); }, [page, hiddenOnly]);

  const toggleHide = async (postId: number) => {
    await api.patch(`/admin/posts/${postId}/hide`);
    fetchPosts();
  };

  const deletePost = async (postId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await api.delete(`/admin/posts/${postId}`);
    fetchPosts();
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h1 className="heading-display text-2xl text-gold mb-6">게시글 관리</h1>

      <div className="flex gap-2 mb-6">
        <button onClick={() => { setHiddenOnly(false); setPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-sm ${!hiddenOnly ? "bg-[var(--color-gold)] text-black font-semibold" : "bg-white/5 text-gray-400"}`}>
          전체
        </button>
        <button onClick={() => { setHiddenOnly(true); setPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-sm ${hiddenOnly ? "bg-[var(--color-gold)] text-black font-semibold" : "bg-white/5 text-gray-400"}`}>
          숨김만
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-white/10">
              <th className="py-3 px-2">제목</th>
              <th className="py-3 px-2">게시판</th>
              <th className="py-3 px-2">작성자</th>
              <th className="py-3 px-2">조회</th>
              <th className="py-3 px-2">상태</th>
              <th className="py-3 px-2">작성일</th>
              <th className="py-3 px-2">액션</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-2 text-white max-w-[200px] truncate">{p.title}</td>
                <td className="py-3 px-2 text-gray-400">{p.board_name}</td>
                <td className="py-3 px-2 text-gray-400">{p.author_nickname}</td>
                <td className="py-3 px-2 text-gray-500">{p.view_count}</td>
                <td className="py-3 px-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${p.is_hidden ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                    {p.is_hidden ? "숨김" : "공개"}
                  </span>
                </td>
                <td className="py-3 px-2 text-gray-500">
                  {p.created_at ? new Date(p.created_at).toLocaleDateString("ko-KR") : ""}
                </td>
                <td className="py-3 px-2">
                  <div className="flex gap-1">
                    <button onClick={() => toggleHide(p.id)}
                      className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30">
                      {p.is_hidden ? "공개" : "숨김"}
                    </button>
                    <button onClick={() => deletePost(p.id)}
                      className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded text-sm ${p === page ? "bg-[var(--color-gold)] text-black" : "bg-white/5 text-gray-400"}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create MeetingManagementPage**

```tsx
// frontend/src/pages/Admin/MeetingManagementPage.tsx
import { useState, useEffect } from "react";
import api from "@/services/api";

interface MeetingItem {
  id: number;
  name: string;
  type: string;
  status: string;
  creator_nickname: string;
  participant_count: number;
  created_at: string;
}

export default function MeetingManagementPage() {
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchMeetings = () => {
    const params: Record<string, string> = {};
    if (statusFilter) params.status_filter = statusFilter;
    api.get("/admin/meetings", { params }).then(({ data }) => setMeetings(data));
  };

  useEffect(() => { fetchMeetings(); }, [statusFilter]);

  const closeMeeting = async (meetingId: number) => {
    await api.post(`/admin/meetings/${meetingId}/close`);
    fetchMeetings();
  };

  return (
    <div>
      <h1 className="heading-display text-2xl text-gold mb-6">회의실 관리</h1>

      <div className="flex gap-2 mb-6">
        {["", "active", "closed"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              statusFilter === s ? "bg-[var(--color-gold)] text-black font-semibold" : "bg-white/5 text-gray-400"
            }`}>
            {s === "" ? "전체" : s === "active" ? "활성" : "종료"}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-white/10">
              <th className="py-3 px-2">회의실명</th>
              <th className="py-3 px-2">타입</th>
              <th className="py-3 px-2">개설자</th>
              <th className="py-3 px-2">참여자</th>
              <th className="py-3 px-2">상태</th>
              <th className="py-3 px-2">생성일</th>
              <th className="py-3 px-2">액션</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((m) => (
              <tr key={m.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-2 text-white">{m.name}</td>
                <td className="py-3 px-2 text-gray-400">{m.type === "video" ? "화상" : "텍스트"}</td>
                <td className="py-3 px-2 text-gray-400">{m.creator_nickname}</td>
                <td className="py-3 px-2 text-gray-400">{m.participant_count}명</td>
                <td className="py-3 px-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    m.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                  }`}>
                    {m.status === "active" ? "활성" : "종료"}
                  </span>
                </td>
                <td className="py-3 px-2 text-gray-500">
                  {m.created_at ? new Date(m.created_at).toLocaleDateString("ko-KR") : ""}
                </td>
                <td className="py-3 px-2">
                  {m.status === "active" && (
                    <button onClick={() => closeMeeting(m.id)}
                      className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">종료</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd c:\WORK\IIFF && git add frontend/src/pages/Admin/ && git commit -m "feat(frontend): add post moderation and meeting management pages"
```

---

## Task 6: Frontend — App.tsx Routes + Integration Test

**Files:**
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Update App.tsx**

Add imports:
```tsx
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboardPage from "@/pages/Admin/AdminDashboardPage";
import UserManagementPage from "@/pages/Admin/UserManagementPage";
import PostModerationPage from "@/pages/Admin/PostModerationPage";
import MeetingManagementPage from "@/pages/Admin/MeetingManagementPage";
```

Add admin route group inside `<Route element={<MainLayout />}>`, after meeting routes:
```tsx
{/* Admin routes */}
<Route path="/admin" element={
  <ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>
}>
  <Route index element={<AdminDashboardPage />} />
  <Route path="users" element={<UserManagementPage />} />
  <Route path="posts" element={<PostModerationPage />} />
  <Route path="meetings" element={<MeetingManagementPage />} />
</Route>
```

- [ ] **Step 2: Verify TypeScript**

Run: `cd c:\WORK\IIFF/frontend && npx tsc --noEmit -p tsconfig.app.json`

- [ ] **Step 3: Build frontend**

Run: `cd c:\WORK\IIFF/frontend && npm run build`

- [ ] **Step 4: Run all backend tests**

Run: `cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/ -v`

- [ ] **Step 5: Commit**

```bash
cd c:\WORK\IIFF && git add frontend/ && git commit -m "feat(frontend): wire up admin routes and complete Phase 5 integration"
```

---

## Summary

After Phase 5 completion:
- Admin API: stats, user CRUD (status/role), post moderation (hide/delete), meeting management (close)
- Role-based access: admin can manage users/posts/meetings, superadmin can additionally change roles
- Frontend: AdminLayout with sidebar, 4 admin pages (dashboard, users, posts, meetings)
- Protected by requireAdmin route guard
- 7 new backend tests

**Next:** Phase 6 — Deployment + Backup (Docker Compose, Nginx, rclone to Google Drive)
