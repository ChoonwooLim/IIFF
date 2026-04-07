# IIFF 프로젝트 개발계획서

## 프로젝트 개요

IIFF (Incheon International Film Festival) 플랫폼 — FastAPI + React + PostgreSQL 풀스택 웹 어플리케이션

## 기술 스택

| 영역 | 기술 |
|------|------|
| Backend | FastAPI, SQLAlchemy 2.0, Alembic, PostgreSQL 16 |
| Frontend | React 19, Vite 8, TypeScript 6, Tailwind CSS 4 |
| Auth | JWT (access + refresh), Google OAuth 2.0, bcrypt |
| Realtime | FastAPI WebSocket, WebRTC (native, Mesh) |
| AI | OpenAI Whisper (STT), GPT-4o-mini (회의록) |
| Infra | Docker Compose, Nginx, rclone |

## 마일스톤

| Phase | 내용 | 상태 | 완료일 |
|-------|------|------|--------|
| Phase 1 | 프로젝트 기반 (FastAPI + React + DB + 홈페이지) | 완료 | 2026-04-06 |
| Phase 2 | 인증 시스템 (로컬 + Google OAuth + 등급제) | 완료 | 2026-04-06 |
| Phase 3 | 게시판 시스템 (6종 + 파일 업로드 + Q&A) | 완료 | 2026-04-06 |
| Phase 4 | 미팅 시스템 (Jitsi 비디오 + WebSocket 채팅) | 완료 | 2026-04-06 |
| Phase 5 | 관리자 대시보드 (유저/게시글/회의실 관리) | 완료 | 2026-04-06 |
| Phase 6 | 배포 + 백업 (Docker + Nginx + rclone) | 완료 | 2026-04-06 |

## 기능 목록

| 기능 | 설명 | Phase | 상태 |
|------|------|-------|------|
| 헬스체크 API | GET /api/health | 1 | 완료 |
| 홈페이지 | IIFF 소개 + 프레젠테이션 뷰어 | 1 | 완료 |
| 로컬 회원가입/로그인 | username/password + 등급제 (즉시 활성화) | 2 | 완료 |
| Google OAuth | 구글 계정 로그인 + 프로필 완성 | 2 | 완료 |
| JWT 인증 | access token 30분 + refresh token 7일 | 2 | 완료 |
| 게시판 6종 | 공지/건의/이미지/동영상/자료실/Q&A | 3 | 완료 |
| 게시글 CRUD | 작성/조회/수정/삭제 + 검색/페이징 | 3 | 완료 |
| 파일 업로드 | 이미지/문서 + 용량/확장자 검증 | 3 | 완료 |
| 댓글 시스템 | 댓글 + 대댓글 (depth 2) | 3 | 완료 |
| Q&A 채택 | 질문자가 답변 채택 | 3 | 완료 |
| 화상 회의 | WebRTC 자체 구현 (Mesh, 시그널링 서버) | 4 | 완료 |
| 텍스트 채팅 | WebSocket 실시간 채팅 + DB 저장 | 4 | 완료 |
| 참여자 추적 | 입장/퇴장 시간 기록 | 4 | 완료 |
| 관리자 대시보드 | 통계 카드 (유저/게시글/회의실) | 5 | 완료 |
| 유저 관리 | 차단/해제 + 등급 변경 (guest/vip/vvip/subadmin/admin) | 5 | 완료 |
| 게시글 관리 | 숨김/공개 토글 + 삭제 | 5 | 완료 |
| 회의실 관리 | 강제 종료 | 5 | 완료 |
| Docker 프로덕션 | 4-service compose (PG + API + FE + Nginx) | 6 | 완료 |
| Nginx 리버스 프록시 | API/WS/업로드/프론트엔드 라우팅 | 6 | 완료 |
| DB 백업 | pg_dump + rclone Google Drive | 6 | 완료 |
| 이미지 WebP 최적화 | JPG → WebP 변환 (-46%) | - | 완료 |
| Navbar 커뮤니티 링크 | 게시판/회의실/관리자/로그인 링크 | - | 완료 |
| Google OAuth 프론트엔드 | @react-oauth/google 연동 | 2 | 완료 |
| HTTPS/SSL | Let's Encrypt + Nginx SSL 설정 | 6 | 완료 |
| E2E 테스트 | Playwright + Chromium (12 테스트) | - | 완료 |
| 회의실 관리 메뉴 | 이름 수정/삭제/⋮ 메뉴 | 4 | 완료 |
| 채팅방 KakaoTalk 스타일 | 메시지 그룹핑, 버블, 시스템 메시지 | 4 | 완료 |
| 회의실 초대 시스템 | 초대 전용 입장 + 유저 검색 + 초대 모달 | 4 | 완료 |
| 회의록 자동 생성 | 종료된 회의 채팅 → 마크다운 문서 | 4 | 완료 |
| 회의실 비밀번호 | 비밀번호 설정/제거 + 비밀번호 입장 | 4 | 완료 |
| 회의 애니메이션 | 카드/채팅/모달/드로어 모션 디자인 | 4 | 완료 |
| 로그아웃 기능 | Navbar 로그아웃 버튼 (데스크톱/모바일) | - | 완료 |
| 등급제 시스템 | guest/vip/vvip 등급, 가입 즉시 활성화 | 2 | 완료 |
| 부관리자(subadmin) | 게시글/공지 관리 권한 (회원관리 제외) | 5 | 완료 |
| 게시글 고정/해제 | 관리자/부관리자 전용 pin/unpin | 5 | 완료 |
| 채팅 파일 전송 | 이미지/동영상/문서 업로드 및 인라인 표시 | 4 | 완료 |
| 파일 SCP 자동 동기화 | 로컬 업로드 시 배포 서버에 자동 SCP 전송 | 6 | 완료 |
| 로컬/배포 DB 통일 | 로컬+배포 모두 orbitron-iiff-db 공유 | 6 | 완료 |
| 파일 경로 크로스 환경 호환 | DB에 상대경로 저장 + STORAGE_BASE_PATH 조합 | 6 | 완료 |
| WebRTC 자체 화상회의 | Jitsi 제거, Mesh 토폴로지, 시그널링 서버 | 4 | 완료 |
| Pre-join 로비 | 디바이스 미리보기, 마이크 레벨, 스피커 테스트 | 4 | 완료 |
| 2x2 스팟라이트 그리드 | 참가자 배치/교체 + 3컬럼 레이아웃 | 4 | 완료 |
| 실시간 팝업 알림 | WebSocket per-user 알림 (초대 등) | 4 | 완료 |
| 온/오프라인 상태 | 초대 시 상대방 온라인 여부 피드백 | 4 | 완료 |
| 회의 시작/OnAir/종료 | started_at 기록, ON AIR 경과시간, 종료 | 4 | 완료 |
| 자동/수동 회의록 | 녹음→Whisper STT→GPT 구조화 회의록 | 4 | 완료 |
| 모바일 반응형 | 랜딩/프레젠테이션 전면 모바일 대응 | - | 완료 |

## 테스트 현황

- Backend: 63 tests passing
- Frontend: TypeScript 컴파일 + Vite 빌드 성공
- Frontend E2E: Playwright 12 tests (homepage, auth, navigation)
- Docker: 이미지 빌드 성공
