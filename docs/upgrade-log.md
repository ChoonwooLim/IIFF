# IIFF 프로젝트 업그레이드 로그

| 날짜 | 변경 내용 | 카테고리 | 관련 파일 |
|------|----------|----------|----------|
| 2026-04-06 | FastAPI 백엔드 스켈레톤 + 헬스체크 | infra | backend/main.py, backend/config.py |
| 2026-04-06 | Alembic 마이그레이션 셋업 | infra | backend/alembic/ |
| 2026-04-06 | React+Vite 프론트엔드 스켈레톤 + Tailwind 디자인 토큰 | feat | frontend/ |
| 2026-04-06 | i18n (EN/KO) 다국어 지원 | feat | frontend/src/i18n/ |
| 2026-04-06 | iiff-web 정적 자산/컴포넌트 마이그레이션 | feat | frontend/src/components/, frontend/public/ |
| 2026-04-06 | 메인 페이지 콘텐츠 + 라우팅 | feat | frontend/src/pages/, frontend/src/App.tsx |
| 2026-04-06 | User 모델 + 듀얼 인증 (local/Google OAuth) | feat | backend/models/user.py, backend/routers/auth.py |
| 2026-04-06 | JWT 토큰 인증 (access + refresh) | feat | backend/services/auth_service.py, backend/deps.py |
| 2026-04-06 | 프론트엔드 인증 (로그인/회원가입/AuthContext/ProtectedRoute) | feat | frontend/src/pages/Auth/, frontend/src/hooks/ |
| 2026-04-06 | Board/Post/Comment/File 모델 + 6종 게시판 | feat | backend/models/, backend/routers/posts.py |
| 2026-04-06 | 파일 업로드 시스템 (LocalStorage + 검증) | feat | backend/services/storage.py |
| 2026-04-06 | 댓글 CRUD + Q&A 채택 기능 | feat | backend/routers/comments.py |
| 2026-04-06 | 프론트엔드 게시판 페이지 (목록/상세/작성) | feat | frontend/src/pages/Board/ |
| 2026-04-06 | Meeting/MeetingParticipant/ChatMessage 모델 | feat | backend/models/meeting.py |
| 2026-04-06 | 미팅 CRUD + 참여자 추적 (7 엔드포인트) | feat | backend/routers/meetings.py |
| 2026-04-06 | WebSocket 채팅 (ConnectionManager + 메시지 저장) | feat | backend/routers/chat.py, backend/services/connection_manager.py |
| 2026-04-06 | 프론트엔드 미팅 페이지 (목록/비디오/채팅) | feat | frontend/src/pages/Meeting/ |
| 2026-04-06 | 관리자 대시보드 API (9 엔드포인트) | feat | backend/routers/admin.py |
| 2026-04-06 | 프론트엔드 관리자 페이지 (4 페이지) | feat | frontend/src/pages/Admin/ |
| 2026-04-06 | Docker Compose 프로덕션 스택 | infra | docker-compose.yml, backend/Dockerfile, frontend/Dockerfile |
| 2026-04-06 | Nginx 리버스 프록시 | infra | nginx/nginx.conf |
| 2026-04-06 | DB 백업 스크립트 (pg_dump + rclone) | infra | scripts/backup-db.sh |
| 2026-04-06 | 프론트엔드 코드 스플리팅 + 벤더 청크 최적화 (메인 번들 -81%) | perf | frontend/src/App.tsx, frontend/vite.config.ts |
