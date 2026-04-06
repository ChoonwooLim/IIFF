# IIFF Platform Restructure — Design Spec

**Date:** 2026-04-06
**Status:** Approved
**Domain:** iiff.twinverse.org

---

## 1. Overview

IIFF(Incheon International Film Festival NextWave) 프로젝트를 기존 Next.js 프레젠테이션 전용 사이트에서 **FastAPI + React + Vite 풀스택 플랫폼**으로 전환한다. 기존 프레젠테이션 콘텐츠는 모두 보존하면서, 로그인, 게시판, 회의실 기능을 추가한다.

### 핵심 변경

- Next.js → React + Vite (프론트엔드 빌드 도구 변경)
- 백엔드 없음 → FastAPI 백엔드 추가
- 정적 콘텐츠 → PostgreSQL 기반 동적 플랫폼

### 보존 항목

- 프레젠테이션 5개 파트 전체 콘텐츠 (소개, 프로그램, 전략, 재무, 거버넌스)
- GSAP / Framer Motion 시네마틱 애니메이션
- 슬라이드 뷰어, PDF 뷰어
- 다크 테마 + 골드(#c9a96e) 컬러 시스템
- 글래스모피즘 UI
- 이미지, PDF 등 정적 자산

---

## 2. System Architecture

```
iiff.twinverse.org
        |
   Nginx Reverse Proxy (기존 SSL)
        |
   +----------+----------+
   |                     |
Frontend              Backend
React+Vite            FastAPI
 :5173                 :8000
   |                     |
   |            +--------+--------+
   |            |                 |
   |        PostgreSQL       DATA Drive
   |        (Docker)         (파일저장)
   |         :5432
   |
   +--- Jitsi Meet (외부 iframe 임베드)
```

### 기술 스택

| 계층 | 기술 | 비고 |
|------|------|------|
| Frontend | React 19 + Vite + TypeScript | Next.js에서 이전 |
| UI | Tailwind CSS 4 + shadcn/ui | 기존 디자인 토큰 유지 |
| Animation | GSAP 3 + Framer Motion | 기존 동일 |
| i18n | react-i18next | next-intl에서 전환 |
| Routing | React Router v7 | Next.js App Router에서 전환 |
| Backend | FastAPI (Python 3.12+) | 신규 |
| ORM | SQLAlchemy 2.0 + Alembic | 신규 |
| DB | PostgreSQL 16 (Docker) | Orbitron 서버 |
| Auth | Google OAuth 2.0 + JWT | 신규 |
| Real-time | FastAPI WebSocket | 텍스트 채팅 |
| Video Chat | Jitsi Meet iframe | 외부 서비스 |
| File Storage | Orbitron DATA 드라이브 | 추상화 레이어 포함 |
| Backup | rclone → Google Drive | 자동 스케줄 |
| Deploy | Docker Compose + Nginx | Orbitron 서버 |

---

## 3. Project Directory Structure

```
c:\WORK\IIFF\
├── backend/
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py           # Google OAuth + JWT + 승인
│   │   ├── users.py          # 회원 관리 CRUD
│   │   ├── boards.py         # 게시판 CRUD
│   │   ├── comments.py       # 댓글 CRUD
│   │   ├── files.py          # 파일 업로드/다운로드
│   │   ├── meetings.py       # 회의실 관리
│   │   ├── chat.py           # WebSocket 텍스트 채팅
│   │   └── admin.py          # 관리자 전용 API
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── board.py
│   │   ├── post.py
│   │   ├── comment.py
│   │   ├── file.py
│   │   ├── meeting.py
│   │   ├── chat_message.py
│   │   └── site_setting.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py   # OAuth + JWT 로직
│   │   ├── storage.py        # 파일 저장소 추상화 레이어
│   │   └── backup.py         # 백업 유틸리티
│   ├── alembic/              # DB 마이그레이션
│   │   └── versions/
│   ├── alembic.ini
│   ├── main.py               # FastAPI 앱 진입점
│   ├── database.py           # DB 연결 설정
│   ├── deps.py               # 의존성 (현재 사용자, DB 세션 등)
│   ├── config.py             # 환경변수 설정
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # shadcn/ui 컴포넌트
│   │   │   ├── layout/       # Header, Footer, Sidebar, Navigation
│   │   │   ├── animation/    # GSAP/Framer Motion (기존 이전)
│   │   │   ├── presentation/ # 슬라이드 뷰어 (기존 이전)
│   │   │   ├── board/        # 게시판 공통 컴포넌트
│   │   │   ├── meeting/      # 회의실 컴포넌트
│   │   │   └── admin/        # 관리자 컴포넌트
│   │   ├── pages/
│   │   │   ├── Home/         # 메인 프레젠테이션 (기존 콘텐츠 이전)
│   │   │   ├── Presentation/ # 슬라이드 뷰어 (기존 이전)
│   │   │   ├── Docs/         # PDF 뷰어 (기존 이전)
│   │   │   ├── Auth/         # 로그인, 프로필 완성, 승인 대기
│   │   │   ├── Board/        # 게시판 6종 (목록, 상세, 작성, 수정)
│   │   │   ├── Meeting/      # 회의실 (영상/텍스트)
│   │   │   └── Admin/        # 관리자 대시보드
│   │   ├── hooks/            # 커스텀 훅 (useAuth, useWebSocket 등)
│   │   ├── services/         # API 클라이언트 (axios)
│   │   ├── lib/              # 유틸리티, 이미지, 슬라이드 데이터
│   │   ├── i18n/             # react-i18next 설정
│   │   ├── styles/           # globals.css + 디자인 토큰
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/               # 정적 자산 (이미지, PDF)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── docker-compose.yml        # PostgreSQL + (향후 Redis)
├── nginx.conf                # 리버스 프록시 + SSL
├── Sorces/                   # 기획 문서 (기존 유지)
├── scripts/
│   ├── backup.sh             # rclone 자동 백업
│   └── seed_admin.py         # 초기 관리자 생성
├── docs/                     # 프로젝트 문서
├── .gitignore
└── CLAUDE.md
```

---

## 4. Database Schema

### 4.1 users

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | |
| google_id | VARCHAR UNIQUE | Google OAuth sub |
| email | VARCHAR UNIQUE NOT NULL | Google 이메일 |
| name | VARCHAR NOT NULL | 실명 |
| nickname | VARCHAR UNIQUE NOT NULL | 닉네임 |
| phone | VARCHAR NOT NULL | 전화번호 |
| profile_image | VARCHAR | Google 프로필 이미지 URL |
| role | ENUM('user','admin','superadmin') | 기본값 'user' |
| status | ENUM('pending','active','rejected','banned') | 기본값 'pending' |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### 4.2 boards

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | |
| slug | VARCHAR UNIQUE | notice, suggestion, image, video, archive, qna |
| name | VARCHAR | 게시판 이름 |
| description | TEXT | 게시판 설명 |
| board_type | ENUM('general','image','video','archive','qna') | 게시판 유형 |
| is_active | BOOLEAN | 활성화 여부 |

### 4.3 posts

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | |
| board_id | FK → boards | |
| user_id | FK → users | |
| title | VARCHAR NOT NULL | |
| content | TEXT NOT NULL | |
| youtube_url | VARCHAR | 동영상 게시판용 YouTube 링크 |
| is_pinned | BOOLEAN | 공지 상단 고정 |
| is_hidden | BOOLEAN | 관리자 숨김 처리 |
| view_count | INTEGER | 조회수 |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### 4.4 comments

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | |
| post_id | FK → posts | |
| user_id | FK → users | |
| parent_id | FK → comments (nullable) | 대댓글 지원 |
| content | TEXT NOT NULL | |
| is_hidden | BOOLEAN | |
| created_at | TIMESTAMP | |

### 4.5 files

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | |
| post_id | FK → posts (nullable) | 게시글 첨부 |
| user_id | FK → users | 업로더 |
| original_name | VARCHAR | 원본 파일명 |
| stored_name | VARCHAR | UUID 저장명 |
| file_path | VARCHAR | 저장 경로 |
| file_size | BIGINT | 바이트 |
| mime_type | VARCHAR | |
| created_at | TIMESTAMP | |

### 4.6 meetings

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | |
| name | VARCHAR NOT NULL | 회의방 이름 |
| type | ENUM('video','text') | 영상/텍스트 |
| created_by | FK → users | |
| status | ENUM('active','closed') | |
| max_participants | INTEGER | 기본값 10 |
| jitsi_room_id | VARCHAR | 영상회의용 Jitsi 방 ID |
| created_at | TIMESTAMP | |
| closed_at | TIMESTAMP | |

### 4.7 meeting_participants

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | |
| meeting_id | FK → meetings | |
| user_id | FK → users | |
| joined_at | TIMESTAMP | |
| left_at | TIMESTAMP | |

### 4.8 chat_messages

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | |
| meeting_id | FK → meetings | |
| user_id | FK → users | |
| content | TEXT NOT NULL | |
| created_at | TIMESTAMP | |

### 4.9 admin_logs

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | |
| admin_id | FK → users | |
| action | VARCHAR | 수행 작업 (approve_user, delete_post 등) |
| target_type | VARCHAR | 대상 유형 (user, post, meeting) |
| target_id | INTEGER | 대상 ID |
| detail | JSONB | 상세 내용 |
| created_at | TIMESTAMP | |

### 4.10 site_settings

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | |
| key | VARCHAR UNIQUE | 설정 키 (logo, banner, main_text 등) |
| value | TEXT | 설정 값 |
| updated_by | FK → users | |
| updated_at | TIMESTAMP | |

---

## 5. Authentication Flow

### 5.1 Google OAuth + 관리자 승인제

```
1. 사용자가 "Google로 로그인" 클릭
2. Google OAuth 2.0 consent screen → 인증 코드 반환
3. Backend: 인증 코드 → access_token → 사용자 정보(email, name, picture)
4. DB에 google_id로 조회:
   - 신규 사용자 → users 테이블에 INSERT (status: 'pending')
     → 프로필 완성 화면으로 이동 (실명, 닉네임, 전화번호 입력)
     → 입력 완료 → "승인 대기 중" 안내 화면
   - 기존 사용자 (status: 'active') → JWT 발급 → 메인 페이지 이동
   - 기존 사용자 (status: 'pending') → "승인 대기 중" 안내 화면
   - 기존 사용자 (status: 'rejected') → "가입이 거부되었습니다" 안내
   - 기존 사용자 (status: 'banned') → "계정이 정지되었습니다" 안내
5. 관리자: Admin 대시보드에서 pending 사용자 목록 확인 → 승인/거부
```

### 5.2 JWT 토큰 구조

- **Access Token**: 30분 만료, payload에 user_id + role
- **Refresh Token**: 7일 만료, httpOnly cookie로 저장
- 모든 API 요청에 Authorization: Bearer {access_token} 헤더 포함

### 5.3 권한 체계

| Role | 프레젠테이션 | 게시판 읽기 | 게시판 쓰기 | 회의실 | 관리자 |
|------|---|---|---|---|---|
| 비로그인 | O | X | X | X | X |
| pending | O | X | X | X | X |
| active (user) | O | O | O | O | X |
| admin | O | O | O | O | O |
| superadmin | O | O | O | O | O (+ 관리자 임명) |

---

## 6. Board System (게시판 6종)

### 6.1 공통 기능

- 목록 (페이지네이션, 검색, 정렬)
- 상세 보기 (조회수 카운트)
- 작성/수정/삭제 (본인 글만)
- 댓글 + 대댓글
- 관리자: 숨김, 삭제, 상단 고정

### 6.2 게시판별 특화

| 게시판 | slug | board_type | 특화 기능 |
|--------|------|-----------|----------|
| 공지사항 | notice | general | 상단 고정, 관리자만 작성 |
| 건의사항 | suggestion | general | 일반 게시판, 답변 기능 |
| 이미지 게시판 | image | image | 이미지 다중 업로드, 갤러리 뷰 (그리드) |
| 동영상 게시판 | video | video | YouTube URL 입력 → 임베드 미리보기 |
| 자료실 | archive | archive | 파일 다중 업로드/다운로드, 파일 크기 표시 |
| Q&A | qna | qna | 질문/답변 구분, 답변 채택 기능 (질문자가 댓글 중 하나를 "채택"하면 해당 댓글이 상단 고정 + 채택 배지 표시) |

### 6.3 파일 업로드 규칙

| 항목 | 제한 |
|------|------|
| 이미지 | jpg, png, gif, webp / 파일당 최대 10MB |
| 문서 | pdf, doc, docx, xls, xlsx, ppt, pptx, hwp / 파일당 최대 50MB |
| 게시글당 최대 첨부 | 10개 |

---

## 7. Meeting System (회의실)

### 7.1 영상 회의실

- Jitsi Meet public 서버 iframe 임베드
- 회의방 생성 시 고유 room ID 자동 생성
- 참여자 목록 DB 기록 (입장/퇴장 시간)
- 최대 10명 동시 참여
- 기본 기능: 화면 공유, 마이크/카메라 on/off, 채팅 (Jitsi 내장)

### 7.2 텍스트 회의실

- FastAPI WebSocket 기반 실시간 채팅
- 회의방별 독립 채팅 공간
- 채팅 이력 DB 저장 (chat_messages 테이블)
- 접속 중인 참여자 목록 실시간 표시
- 메시지: 텍스트 + 이모지
- 최대 10명 동시 참여

### 7.3 WebSocket 프로토콜

```json
// 클라이언트 → 서버
{"type": "join", "meeting_id": 1}
{"type": "message", "content": "안녕하세요"}
{"type": "leave"}

// 서버 → 클라이언트
{"type": "user_joined", "user": {"id": 1, "nickname": "홍길동"}}
{"type": "new_message", "user": {"id": 1, "nickname": "홍길동"}, "content": "안녕하세요", "timestamp": "..."}
{"type": "user_left", "user": {"id": 1, "nickname": "홍길동"}}
{"type": "participants", "users": [...]}
```

---

## 8. Admin Dashboard (관리자 대시보드)

### 8.1 회원 관리

- 가입 승인 대기 목록 (pending 사용자)
- 승인/거부 처리
- 전체 회원 목록 (검색, 필터)
- 권한 변경 (user ↔ admin), 계정 정지(ban)

### 8.2 게시판 관리

- 전체 게시글 목록 (게시판별 필터)
- 게시글 숨김/삭제
- 신고된 게시글 처리
- 공지사항 상단 고정 설정

### 8.3 회의실 관리

- 활성 회의방 목록
- 회의방 강제 종료
- 참여자 강제 퇴장

### 8.4 통계 대시보드

- 총 회원 수 / 일일 신규 가입
- 게시판별 게시글 수 / 일일 신규 게시글
- 활성 회의방 수 / 현재 접속자 수
- 최근 7일/30일 트렌드 차트

### 8.5 공지사항 작성

- 관리자 전용 공지사항 게시판 글쓰기
- 상단 고정 / 해제

### 8.6 사이트 설정

- 로고 이미지 변경
- 메인 배너 이미지/텍스트 변경
- 푸터 텍스트 변경
- 설정 변경 이력 관리 (admin_logs)

---

## 9. File Storage Abstraction (파일 저장소 추상화)

```python
# services/storage.py

class StorageBackend(ABC):
    @abstractmethod
    async def upload(self, file: UploadFile, directory: str) -> str:
        """파일 업로드, 저장된 경로 반환"""

    @abstractmethod
    async def download(self, file_path: str) -> FileResponse:
        """파일 다운로드"""

    @abstractmethod
    async def delete(self, file_path: str) -> bool:
        """파일 삭제"""

class LocalStorage(StorageBackend):
    """Orbitron DATA 드라이브 로컬 저장"""
    def __init__(self, base_path: str = "D:/DATA/iiff-uploads"):
        ...

class S3Storage(StorageBackend):
    """향후 AWS S3 전환용"""
    ...
```

- 파일명은 UUID로 저장 (충돌 방지)
- DB에는 파일 메타 정보만 저장 (경로, 원본명, 크기, MIME)
- `config.py`에서 `STORAGE_BACKEND=local` 설정으로 전환

---

## 10. Automated Backup

### 10.1 파일 백업

```bash
# 매일 03:00 — DATA 드라이브 → Google Drive (변경분만)
rclone sync D:/DATA/iiff-uploads gdrive:IIFF-Backup/uploads
```

### 10.2 DB 백업

```bash
# 매일 03:30 — PostgreSQL 전체 덤프 → 압축 → Google Drive
pg_dump -h localhost -U iiff_user iiff_db | gzip > /tmp/iiff_db_$(date +%Y%m%d).sql.gz
rclone copy /tmp/iiff_db_$(date +%Y%m%d).sql.gz gdrive:IIFF-Backup/db/
# 30일 이전 백업 자동 삭제
rclone delete gdrive:IIFF-Backup/db/ --min-age 30d
```

### 10.3 스케줄

Windows Task Scheduler 또는 Docker cron 컨테이너로 자동 실행.
백업 실패 시 로그 기록.

---

## 11. Deployment (Orbitron)

### 11.1 docker-compose.yml 구성

- **postgres**: PostgreSQL 16, 포트 5432, 볼륨 마운트
- **backend**: FastAPI, 포트 8000, depends_on postgres
- **frontend**: Vite 빌드 결과물을 Nginx로 서빙

### 11.2 Nginx 설정

```
iiff.twinverse.org
  /              → frontend (정적 파일)
  /api/          → backend:8000 (FastAPI)
  /ws/           → backend:8000 (WebSocket upgrade)
```

### 11.3 환경변수

```env
# backend/.env
DATABASE_URL=postgresql://iiff_user:password@postgres:5432/iiff_db
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
JWT_SECRET_KEY=...
STORAGE_BASE_PATH=D:/DATA/iiff-uploads
ALLOWED_ORIGINS=https://iiff.twinverse.org
```

---

## 12. Migration Plan (Next.js → React+Vite)

기존 iiff-web 코드 이전 항목:

| 기존 (Next.js) | 신규 (React+Vite) | 변경 수준 |
|---|---|---|
| page.tsx (메인 콘텐츠 1520줄) | pages/Home/ 분할 | 리팩토링 |
| next/font → Playfair, Inter, Noto Sans KR | @fontsource 또는 CSS import | 경로 변경 |
| next/image | img 태그 + lazy loading | 단순 교체 |
| next-intl | react-i18next | 라이브러리 교체 |
| next-themes | 자체 ThemeProvider (CSS 변수) | 단순 교체 |
| App Router (layout.tsx) | React Router + Layout 컴포넌트 | 구조 변경 |
| GSAP 컴포넌트 (6개) | 그대로 복사 | 변경 없음 |
| Framer Motion 컴포넌트 | 그대로 복사 | 변경 없음 |
| UI 컴포넌트 (GlassCard 등 12개) | 그대로 복사 | 변경 없음 |
| globals.css (디자인 토큰) | 그대로 복사 | 변경 없음 |
| content/ko/sections.json | 그대로 복사 | 변경 없음 |
| lib/images.ts, slides.ts | 그대로 복사 | 변경 없음 |
| messages/en.json, ko.json | react-i18next 형식으로 변환 | 형식 변경 |
| public/ (이미지, PDF) | 그대로 복사 | 변경 없음 |

---

## 13. Future Expansion Paths

| 현재 | 확장 트리거 | 확장 방향 |
|------|-----------|----------|
| Jitsi iframe | 브랜딩/커스터마이징 필요 | Jitsi 셀프호스팅 |
| FastAPI WebSocket | 동시접속 50명+ | Redis Pub/Sub 추가 |
| DATA 드라이브 | 스토리지 부족 | AWS S3 전환 (추상화 레이어) |
| 단일 서버 | 트래픽 증가 | 프론트/백엔드 분리 배포 |
| Google Drive 백업 | 엔터프라이즈 | AWS S3 백업 + 포인트 인 타임 리커버리 |
