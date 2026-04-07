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
| 2026-04-06 | 이미지 WebP 변환 (25개 JPG → WebP, -46%) | perf | frontend/public/images/, frontend/src/lib/images.ts |
| 2026-04-06 | Navbar 커뮤니티/관리자 링크 + 로그인 버튼 | feat | frontend/src/components/layout/Navbar.tsx |
| 2026-04-06 | Google OAuth 프론트엔드 연동 (@react-oauth/google) | feat | frontend/src/main.tsx, frontend/src/pages/Auth/LoginPage.tsx |
| 2026-04-06 | HTTPS/SSL Let's Encrypt 설정 | infra | nginx/nginx-ssl.conf, docker-compose.ssl.yml, scripts/init-ssl.sh |
| 2026-04-06 | Playwright E2E 테스트 프레임워크 | feat | frontend/e2e/, frontend/playwright.config.ts |
| 2026-04-06 | Google OAuth 설정 가이드 | docs | docs/google-oauth-setup.md |
| 2026-04-06 | 회의실 이름 수정/삭제 + ⋮ 관리 메뉴 | feat | frontend/src/components/meeting/MeetingCard.tsx, backend/routers/meetings.py |
| 2026-04-06 | 텍스트 채팅방 KakaoTalk 스타일 리디자인 | feat | frontend/src/pages/Meeting/TextChatPage.tsx, frontend/src/components/meeting/ChatMessage.tsx |
| 2026-04-06 | 회의실 초대 시스템 (초대 전용 입장) | feat | backend/models/meeting_invitation.py, backend/routers/meetings.py, frontend/src/components/meeting/InviteModal.tsx |
| 2026-04-06 | 회의록 자동 생성 (채팅 내용 → 마크다운) | feat | backend/models/meeting_minutes.py, backend/routers/meetings.py |
| 2026-04-06 | 회의록 목록/상세 페이지 | feat | frontend/src/pages/Meeting/MeetingMinutesListPage.tsx, MeetingMinutesDetailPage.tsx |
| 2026-04-06 | 회의실 비밀번호 입장 기능 | feat | backend/models/meeting.py, backend/routers/meetings.py, frontend/src/components/meeting/MeetingCard.tsx |
| 2026-04-06 | 회의 기능 애니메이션 (10개 keyframes, 카드/채팅/모달/드로어) | style | frontend/src/globals.css, 전체 meeting 컴포넌트 |
| 2026-04-06 | 로그아웃 기능 (데스크톱/모바일) | feat | frontend/src/components/layout/Navbar.tsx |
| 2026-04-06 | 등급제 전환 (승인제 → guest/vip/vvip, 즉시 활성화) | feat | backend/models/user.py, backend/routers/auth.py, frontend 전체 Auth 페이지 |
| 2026-04-06 | 가입 시 자동 로그인 | feat | backend/routers/auth.py, frontend/src/pages/Auth/RegisterPage.tsx |
| 2026-04-06 | 부관리자(subadmin) 등급 + 게시글/공지 관리 권한 | feat | backend/deps.py, backend/routers/admin.py, frontend/src/components/admin/AdminLayout.tsx |
| 2026-04-06 | 게시글 고정/해제 기능 | feat | backend/routers/admin.py, frontend/src/pages/Admin/PostModerationPage.tsx |
| 2026-04-06 | 채팅 파일 전송 (이미지/동영상/문서) | feat | backend/models/chat_message.py, backend/routers/meetings.py, frontend/src/components/meeting/ChatMessage.tsx |
| 2026-04-07 | 파일 업로드 시 서버 자동 SCP 동기화 | feat | backend/services/storage.py, scripts/sync-uploads.sh |
| 2026-04-07 | 로컬/배포 DB 통일 (orbitron-iiff-db 공유) | infra | docker-compose.yml, .env |
| 2026-04-07 | Docker 바인드 마운트 전환 (named volume → ./uploads) | infra | docker-compose.yml |
| 2026-04-07 | 파일 경로 크로스 환경 호환 (상대경로 저장) | feat | backend/services/storage.py, backend/routers/posts.py |
| 2026-04-07 | 히어로 비디오 YouTube → 로컬 MP4 교체 (자동재생+컨트롤) | feat | frontend/src/pages/Home/HomePage.tsx, frontend/public/iiff-part2.mp4 |
| 2026-04-07 | 비디오 플레이어 180% 확대 (컨테이너 브레이크아웃) | feat | frontend/src/pages/Home/HomePage.tsx |
| 2026-04-07 | 로고 클릭 시 홈 최상단 스크롤 | feat | frontend/src/components/layout/Navbar.tsx |
| 2026-04-07 | Navbar 오디오 뮤트 토글 버튼 | feat | frontend/src/components/layout/Navbar.tsx |
| 2026-04-07 | Navbar 다크/라이트 모드 토글 | feat | frontend/src/components/layout/Navbar.tsx, frontend/src/components/ui/ThemeToggle.tsx |
| 2026-04-07 | Git LFS 설정 (*.mp4 추적) | infra | .gitattributes |
| 2026-04-07 | WebRTC 자체 화상회의 (Jitsi 제거, Mesh 토폴로지) | feat | backend/routers/video_signaling.py, backend/services/video_connection_manager.py, frontend/src/hooks/useWebRTC.ts |
| 2026-04-07 | Pre-join 로비 (디바이스 미리보기, 스피커 테스트) | feat | frontend/src/components/meeting/PreJoinLobby.tsx |
| 2026-04-07 | 2x2 스팟라이트 그리드 + 참가자 배치 | feat | frontend/src/pages/Meeting/VideoRoomPage.tsx |
| 2026-04-07 | 실시간 팝업 알림 시스템 | feat | backend/services/notification_manager.py, backend/routers/notifications.py, frontend/src/hooks/useNotifications.ts, frontend/src/components/common/NotificationToast.tsx |
| 2026-04-07 | 초대 시 온/오프라인 상태 피드백 | feat | backend/routers/meetings.py, frontend/src/components/meeting/InviteModal.tsx |
| 2026-04-07 | VVIP 회의실 관리 권한 | feat | backend/routers/meetings.py |
| 2026-04-07 | npm run dev 프론트+백엔드 동시 실행 | feat | frontend/package.json |
| 2026-04-07 | 회의 시작/OnAir/종료 컨트롤 | feat | backend/routers/meetings.py, backend/models/meeting.py, frontend/src/components/meeting/PreJoinLobby.tsx |
| 2026-04-07 | 자동/수동 회의록 (녹음→Whisper STT→GPT) | feat | backend/services/transcription.py, frontend/src/hooks/useAudioRecorder.ts, backend/routers/meetings.py |
| 2026-04-07 | 모바일 반응형 전면 적용 | style | frontend/src/pages/, frontend/src/components/ |
