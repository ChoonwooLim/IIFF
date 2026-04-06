# IIFF 프로젝트 작업일지

## 2026-04-06

### 작업 요약

| 카테고리 | 작업 내용 | 상태 |
|----------|----------|------|
| infra | Docker PostgreSQL 16 셋업 (port 5433) | 완료 |
| feat | Phase 1: FastAPI 백엔드 스켈레톤 + React/Vite 프론트엔드 스켈레톤 | 완료 |
| feat | Phase 1: Alembic 마이그레이션, Tailwind 디자인 토큰, i18n, 정적 자산 마이그레이션 | 완료 |
| feat | Phase 1: 메인 페이지 콘텐츠 + 라우팅 (MainLayout) | 완료 |
| fix | TypeScript 6 마이그레이션 빌드/타입 에러 수정 | 완료 |
| feat | Phase 2: 인증 시스템 (User 모델, JWT, bcrypt, 로컬+Google OAuth) | 완료 |
| feat | Phase 2: Auth 라우터 7개 엔드포인트, Auth 프론트엔드 (로그인/회원가입/대기/프로필완성) | 완료 |
| feat | Phase 2: SuperAdmin 시드 스크립트 | 완료 |
| feat | Phase 3: 게시판 시스템 (Board/Post/Comment/File 모델, 6종 게시판) | 완료 |
| feat | Phase 3: 게시글 CRUD + 파일 업로드, 댓글 CRUD + Q&A 채택, 프론트엔드 게시판 페이지 | 완료 |
| feat | Phase 4: 미팅 시스템 (Meeting/MeetingParticipant/ChatMessage 모델) | 완료 |
| feat | Phase 4: 미팅 CRUD + 참여자 추적, WebSocket 채팅 (ConnectionManager + 메시지 저장) | 완료 |
| feat | Phase 4: 프론트엔드 미팅 페이지 (목록, Jitsi 비디오룸, 텍스트 채팅) | 완료 |
| feat | Phase 5: 관리자 대시보드 API (유저/게시글/회의실 관리 9개 엔드포인트) | 완료 |
| feat | Phase 5: 프론트엔드 관리자 페이지 (대시보드, 회원관리, 게시글관리, 회의실관리) | 완료 |
| feat | Phase 6: Docker Compose 프로덕션 스택 (Backend + Frontend + Nginx + PostgreSQL) | 완료 |
| feat | Phase 6: Nginx 리버스 프록시 (API/WebSocket/업로드/프론트엔드 라우팅) | 완료 |
| feat | Phase 6: DB 백업 스크립트 (pg_dump + rclone Google Drive) | 완료 |
| docs | 설계 스펙 + Phase 1~6 구현 계획서 작성 | 완료 |

### 세부 내용

- **프로젝트 전체 구조 전환**: Next.js 단일 앱에서 FastAPI + React + Vite + PostgreSQL 풀스택 아키텍처로 전환
- **Phase 1 (기반)**: FastAPI 스켈레톤, Alembic, React/Vite 스켈레톤, Tailwind CSS 4 디자인 토큰, iiff-web 정적 자산/컴포넌트 마이그레이션
- **Phase 2 (인증)**: 듀얼 인증 (로컬 회원가입 + Google OAuth 2.0), 관리자 승인 플로우 (pending → active), JWT 토큰 (access 30분 + refresh 7일 httpOnly), 프론트엔드 AuthContext + ProtectedRoute
- **Phase 3 (게시판)**: 6종 게시판 (공지/건의/이미지/동영상/자료실/Q&A), 타입별 비즈니스 로직, 파일 업로드 (multipart), 댓글 + 대댓글 (depth 2), Q&A 채택 기능
- **Phase 4 (미팅)**: Jitsi 공개 서버 iframe 비디오 룸, FastAPI WebSocket 텍스트 채팅, ConnectionManager (인메모리) + DB 메시지 저장, 참여자 추적
- **Phase 5 (관리자)**: 대시보드 통계, 유저 관리 (승인/거절/차단/역할변경), 게시글 관리 (숨김/삭제), 회의실 관리 (강제종료), superadmin 보호
- **Phase 6 (배포)**: Docker Compose 프로덕션 (4 서비스), Nginx 리버스 프록시, Alembic 자동 마이그레이션, 백업 스크립트 (pg_dump + rclone)
- **테스트**: 백엔드 63개 테스트 전체 통과, 프론트엔드 빌드 성공, Docker 이미지 빌드 성공

---
