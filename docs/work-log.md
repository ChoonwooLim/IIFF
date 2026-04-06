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
- **성능 최적화**: React.lazy() 코드 스플리팅 (17개 라우트), 벤더 청크 분리 (react/animation/i18n), 메인 번들 754KB → 142KB (-81%)

---

### 추가 작업 (세션 2)

| 카테고리 | 작업 내용 | 상태 |
|----------|----------|------|
| perf | 이미지 WebP 변환 (25개 JPG → WebP, 7MB → 3.8MB, -46%) | 완료 |
| feat | Navbar에 게시판/회의실/관리자 링크 + 로그인 버튼 추가 | 완료 |
| feat | Google OAuth 프론트엔드 연동 (@react-oauth/google + LoginPage 연결) | 완료 |
| infra | HTTPS/SSL Let's Encrypt 설정 (nginx-ssl.conf, certbot, init-ssl.sh) | 완료 |
| feat | Playwright E2E 테스트 프레임워크 설정 + 3개 테스트 파일 (12 테스트) | 완료 |
| docs | Google OAuth 설정 가이드 작성 | 완료 |

### 세부 내용

- **이미지 최적화**: sharp 라이브러리로 25개 JPG를 WebP(quality 82)로 변환, images.ts/images.d.ts 참조 일괄 업데이트
- **Navbar 확장**: 커뮤니티 링크 (게시판, 회의실), 관리자 링크 (admin/superadmin만 표시), 로그인/사용자 표시, 활성 경로 하이라이트, 모바일 메뉴 대응
- **Google OAuth**: @react-oauth/google 설치, GoogleOAuthProvider 래핑, LoginPage에 useGoogleLogin 훅 연결 (auth-code flow)
- **HTTPS/SSL**: nginx-ssl.conf (HTTP→HTTPS 리다이렉트, TLS 1.2/1.3, HSTS), docker-compose.ssl.yml (certbot 컨테이너 + 자동갱신), init-ssl.sh (초기 인증서 발급 스크립트)
- **E2E 테스트**: Playwright + Chromium, homepage.spec.ts (4 테스트), auth.spec.ts (4 테스트), navigation.spec.ts (4 테스트)

---
