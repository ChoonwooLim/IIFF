# IIFF 프로젝트 개발계획서

## 프로젝트 개요

IIFF (Incheon International Film Festival) 플랫폼 — FastAPI + React + PostgreSQL 풀스택 웹 어플리케이션

## 기술 스택

| 영역 | 기술 |
|------|------|
| Backend | FastAPI, SQLAlchemy 2.0, Alembic, PostgreSQL 16 |
| Frontend | React 19, Vite 8, TypeScript 6, Tailwind CSS 4 |
| Auth | JWT (access + refresh), Google OAuth 2.0, bcrypt |
| Realtime | FastAPI WebSocket, Jitsi Meet (public) |
| Infra | Docker Compose, Nginx, rclone |

## 마일스톤

| Phase | 내용 | 상태 | 완료일 |
|-------|------|------|--------|
| Phase 1 | 프로젝트 기반 (FastAPI + React + DB + 홈페이지) | 완료 | 2026-04-06 |
| Phase 2 | 인증 시스템 (로컬 + Google OAuth + 관리자 승인) | 완료 | 2026-04-06 |
| Phase 3 | 게시판 시스템 (6종 + 파일 업로드 + Q&A) | 완료 | 2026-04-06 |
| Phase 4 | 미팅 시스템 (Jitsi 비디오 + WebSocket 채팅) | 완료 | 2026-04-06 |
| Phase 5 | 관리자 대시보드 (유저/게시글/회의실 관리) | 완료 | 2026-04-06 |
| Phase 6 | 배포 + 백업 (Docker + Nginx + rclone) | 완료 | 2026-04-06 |

## 기능 목록

| 기능 | 설명 | Phase | 상태 |
|------|------|-------|------|
| 헬스체크 API | GET /api/health | 1 | 완료 |
| 홈페이지 | IIFF 소개 + 프레젠테이션 뷰어 | 1 | 완료 |
| 로컬 회원가입/로그인 | username/password + 관리자 승인 | 2 | 완료 |
| Google OAuth | 구글 계정 로그인 + 프로필 완성 | 2 | 완료 |
| JWT 인증 | access token 30분 + refresh token 7일 | 2 | 완료 |
| 게시판 6종 | 공지/건의/이미지/동영상/자료실/Q&A | 3 | 완료 |
| 게시글 CRUD | 작성/조회/수정/삭제 + 검색/페이징 | 3 | 완료 |
| 파일 업로드 | 이미지/문서 + 용량/확장자 검증 | 3 | 완료 |
| 댓글 시스템 | 댓글 + 대댓글 (depth 2) | 3 | 완료 |
| Q&A 채택 | 질문자가 답변 채택 | 3 | 완료 |
| 화상 회의 | Jitsi Meet 공개 서버 iframe | 4 | 완료 |
| 텍스트 채팅 | WebSocket 실시간 채팅 + DB 저장 | 4 | 완료 |
| 참여자 추적 | 입장/퇴장 시간 기록 | 4 | 완료 |
| 관리자 대시보드 | 통계 카드 (유저/게시글/회의실) | 5 | 완료 |
| 유저 관리 | 승인/거절/차단 + 역할 변경 | 5 | 완료 |
| 게시글 관리 | 숨김/공개 토글 + 삭제 | 5 | 완료 |
| 회의실 관리 | 강제 종료 | 5 | 완료 |
| Docker 프로덕션 | 4-service compose (PG + API + FE + Nginx) | 6 | 완료 |
| Nginx 리버스 프록시 | API/WS/업로드/프론트엔드 라우팅 | 6 | 완료 |
| DB 백업 | pg_dump + rclone Google Drive | 6 | 완료 |

## 테스트 현황

- Backend: 63 tests passing
- Frontend: TypeScript 컴파일 + Vite 빌드 성공
- Docker: 이미지 빌드 성공
