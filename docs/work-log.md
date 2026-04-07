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

### 추가 작업 (세션 3)

| 카테고리 | 작업 내용 | 상태 |
|----------|----------|------|
| feat | 회의실 이름 수정/삭제 (⋮ 메뉴), 회의실 사용 가이드 섹션 | 완료 |
| feat | 텍스트 채팅방 카카오톡 스타일 리디자인 (메시지 그룹핑, 시스템 메시지, 날짜 구분선) | 완료 |
| feat | 회의실 초대 시스템 (초대받은 사용자만 입장 가능, 멤버 초대 모달) | 완료 |
| feat | 회의록 생성 기능 (종료된 회의에서 대화 내용을 마크다운 문서로 자동 생성) | 완료 |
| feat | 회의록 목록/상세 페이지 (프론트엔드) | 완료 |
| feat | 회의실 비밀번호 설정/제거 기능 (비밀번호로 입장 가능) | 완료 |
| style | 회의 기능 전체 애니메이션 추가 (카드 입장, 채팅 버블, 모달, 드로어 등) | 완료 |
| fix | FastAPI 라우트 순서 충돌 (minutes/list가 {meeting_id}에 매칭되는 문제) | 완료 |
| fix | React StrictMode WebSocket 이중 연결 문제 (cancelled 플래그 패턴) | 완료 |
| fix | Vite 프록시 포트 변경 (8001→8002, 좀비 프로세스 회피) | 완료 |

### 세부 내용

- **회의실 관리**: MeetingCard에 ⋮ 메뉴 추가 (멤버 초대, 비밀번호 설정, 이름 수정, 삭제), 인라인 이름 수정 (Enter 저장, Escape 취소)
- **채팅방 리디자인**: KakaoTalk 스타일 — 내 메시지 오른쪽 골드 버블, 상대 메시지 왼쪽 다크 버블, 연속 메시지 아바타/닉네임 그룹핑, 시스템 메시지 (입장/퇴장), 날짜 구분선, 최대 520px 너비
- **초대 시스템**: MeetingInvitation 모델, 유저 검색 API, 초대/제거 API, 채팅방 내 초대 모달, WebSocket 핸들러 초대 확인
- **회의록**: MeetingMinutes 모델, 종료된 회의에서 POST 호출 시 채팅 내용을 마크다운으로 자동 생성, 회의록 목록/상세 페이지, 마크다운 렌더러 (볼드, 이탤릭, 채팅 메시지 스타일링)
- **비밀번호 입장**: Meeting 모델에 password 컬럼, PUT/DELETE 비밀번호 관리 API, 입장 시 초대 OR 비밀번호 OR 개설자/어드민 3가지 중 하나 충족 시 허용
- **애니메이션**: 10개 신규 @keyframes (msgSlideLeft/Right, modalScaleIn, drawerSlideIn, cardStagger 등), 모든 ease-out-expo 커브, prefers-reduced-motion 글로벌 대응

---

### 추가 작업 (세션 4)

| 카테고리 | 작업 내용 | 상태 |
|----------|----------|------|
| feat | 로그아웃 기능 (Navbar에 로그아웃 버튼 추가, 데스크톱/모바일) | 완료 |
| feat | 등급제 전환 (승인제 → 등급제: guest/vip/vvip, 가입 즉시 활성화) | 완료 |
| feat | 가입 시 자동 로그인 (register에서 access_token 반환 → 즉시 로그인) | 완료 |
| feat | 부관리자(subadmin) 등급 추가 (게시글/공지 관리 권한) | 완료 |
| feat | 게시글 고정/해제 기능 (관리자/부관리자 전용) | 완료 |
| feat | 채팅 파일 전송 (이미지/동영상/문서 업로드 및 인라인 표시) | 완료 |
| style | Navbar 로고 변경 (IIFF 텍스트 → NextWave 2026) | 완료 |
| style | 텍스트 채팅방 가로 폭 확대 (520px → 940px) | 완료 |
| fix | 백엔드 500 에러 (모델 변경 후 서버 미재시작) | 완료 |

### 세부 내용

- **등급제 전환**: User 모델 role/status를 Enum에서 String으로 변경, 기본값 guest/active, 승인 대기(pending) 플로우 완전 제거, PendingPage 라우트 제거
- **부관리자(subadmin)**: deps.py에 `require_moderator` 의존성 추가 (subadmin/admin/superadmin), 공지사항 작성/게시글 관리 권한 부여, AdminLayout에서 부관리자는 게시글 관리만 표시
- **게시글 고정**: admin.py에 `PATCH /posts/{post_id}/pin` 엔드포인트 추가, PostModerationPage에 고정/해제 버튼 및 고정 뱃지 표시
- **채팅 파일 전송**: ChatMessage 모델에 file_url/file_name/file_type/file_size 컬럼 추가, REST 파일 업로드 엔드포인트 + WebSocket 파일 메시지 브로드캐스트, 프론트엔드에서 이미지 인라인 미리보기/동영상 플레이어/문서 다운로드 카드 렌더링
- **프론트엔드 정리**: ProtectedRoute/LoginPage/ProfileCompletePage에서 pending 관련 코드 제거, AdminDashboardPage 등급별 통계 표시, UserManagementPage 등급 드롭다운 (guest/vip/vvip/subadmin/admin)

---

### 추가 작업 (세션 5) - 배포/인프라 안정화

| 카테고리 | 작업 내용 | 상태 |
|----------|----------|------|
| fix | TypeScript 빌드 에러 수정 (useRef strict mode, 미사용 변수, stale .d.ts) | 완료 |
| fix | models/__init__.py에 MeetingInvitation/MeetingMinutes 임포트 누락 수정 | 완료 |
| fix | 배포 DB 인증 실패 수정 (orbitron_user → iiff_user 불일치) | 완료 |
| fix | 배포 DB 스키마 누락 (meeting_invitations, meeting_minutes 테이블, password/file 컬럼) | 완료 |
| fix | 파일 경로 크로스 환경 호환 (절대경로 → 상대경로 저장) | 완료 |
| infra | 로컬/배포 DB 통일 (orbitron-iiff-db 공유) | 완료 |
| infra | Docker 볼륨 → 호스트 바인드 마운트 변경 (./uploads) | 완료 |
| infra | 서버 Samba 공유 설정 (iiff-uploads) | 완료 |
| feat | 파일 업로드 시 서버 자동 SCP 동기화 기능 | 완료 |
| feat | 회의실 사용 가이드 업그레이드 (문자회의실/화상회의실 분리 상세 설명) | 완료 |

### 세부 내용

- **빌드 에러 수정**: `InviteModal.tsx` useRef strict mode, `MeetingMinutesDetailPage.tsx` 미사용 변수, tsconfig `declarationDir` 설정으로 stale .d.ts 문제 해결
- **배포 DB 통일**: docker-compose의 DATABASE_URL을 `.env`에서 주입하도록 변경, 로컬/배포 모두 orbitron-iiff-db (192.168.219.101:3590) 사용
- **배포 스키마 동기화**: meeting_invitations, meeting_minutes 테이블 생성, meetings.password, chat_messages 파일 컬럼 추가
- **파일 시스템 통합**: storage.py에서 상대경로(images/xxx.webp) 저장, get_path()에서 STORAGE_BASE_PATH + 상대경로 조합, 로컬→서버 자동 SCP 동기화
- **서버 인프라**: Samba 설치/설정, Docker 바인드 마운트로 전환, admin 비밀번호 재설정

---

## 2026-04-07 (세션 7 - 프론트엔드 UX 개선)

### 작업 요약

| 카테고리 | 작업 내용 | 상태 |
|----------|----------|------|
| feat | 히어로 비디오 YouTube → 로컬 MP4 교체 (자동재생, 컨트롤) | 완료 |
| feat | 비디오 플레이어 크기 180% 확대 (컨테이너 브레이크아웃) | 완료 |
| feat | 로고 클릭 시 홈 최상단 스크롤 | 완료 |
| feat | Navbar 오디오 뮤트 토글 버튼 추가 | 완료 |
| feat | Navbar 다크/라이트 모드 토글 추가 (ThemeToggle) | 완료 |
| fix | Vite 프록시 포트 불일치 수정 (8002 → 8000) | 완료 |
| fix | 라이트 모드 color-scheme 미적용 수정 | 완료 |
| infra | Git LFS 설정 (*.mp4 파일 추적) | 완료 |

### 세부 내용

- **히어로 비디오**: YouTube iframe을 로컬 `iiff-part2.mp4`로 교체, `useRef`+`useEffect`로 muted 자동재생 후 즉시 음소거 해제 구현
- **비디오 크기**: 부모 컨테이너(`max-w-4xl`) 밖으로 확장, `width: 180%` + `translateX(-50%)` 중앙정렬, `maxWidth: 96vw`로 뷰포트 제한
- **오디오 뮤트**: MutationObserver로 동적 생성 미디어 요소도 감지, localStorage에 상태 저장
- **다크/라이트 모드**: 기존 ThemeToggle 컴포넌트를 Navbar에 배치, `color-scheme: light` CSS 추가로 브라우저 기본 UI 라이트 모드 대응
- **로컬 개발 환경**: Vite 프록시를 8000으로 수정, 백엔드 pip 의존성 설치, 배포 서버 DB 연결로 로그인 정상화

---

## 2026-04-07 (세션 8 - 화상회의 시스템 고도화)

### 작업 요약

| 카테고리 | 작업 내용 | 상태 |
|----------|----------|------|
| feat | WebRTC 자체 화상회의 시스템 구축 (Jitsi 제거) | 완료 |
| feat | Pre-join 로비 (디바이스 미리보기, 스피커 테스트) | 완료 |
| feat | 화상회의 2x2 스팟라이트 + 3컬럼 레이아웃 | 완료 |
| feat | 실시간 팝업 알림 시스템 (회의 초대) | 완료 |
| feat | 초대 시 온/오프라인 상태 피드백 | 완료 |
| feat | VVIP 회의실 관리 권한 | 완료 |
| feat | npm run dev 프론트+백엔드 동시 실행 | 완료 |
| feat | 회의 시작/OnAir/종료 버튼 (PreJoinLobby) | 완료 |
| feat | 자동/수동 회의록 시스템 (녹음→STT→GPT 회의록) | 완료 |
| fix | 채팅 연결 불가 수정 (video 타입 허용) | 완료 |
| fix | 카메라 토글 후 영상 안 나오는 문제 (2단계 수정) | 완료 |
| fix | 네비게이션 바 가림 방지 여백 | 완료 |
| fix | 배포 빌드 TS 에러 수정 | 완료 |
| fix | 멤버 초대 모달 확인 버튼 추가 | 완료 |
| style | 모바일 반응형 전면 적용 | 완료 |

### 세부 내용

- **WebRTC 자체 구현**: Jitsi Meet iframe을 제거하고 브라우저 네이티브 WebRTC API(RTCPeerConnection, getUserMedia)로 Mesh 토폴로지 화상회의 구현. 시그널링 서버(video_signaling.py), useWebRTC 훅, VideoGrid/VideoTile/VideoControlBar 컴포넌트
- **스팟라이트 그리드**: 2x2 고정 화면 + 참가자 썸네일 사이드바 + 채팅 패널의 3컬럼 레이아웃. 사용자가 슬롯에 참가자 배치/교체 가능
- **알림 시스템**: WebSocket 기반 per-user 실시간 알림 (NotificationManager → NotificationToast). 회의 초대 시 온라인이면 즉시 팝업, 오프라인이면 초대자에게 피드백
- **회의 시작/종료 컨트롤**: PreJoinLobby에 회의 시작(started_at 기록), ON AIR 경과시간 표시(파란 LED), 회의 종료 버튼. DB에 started_at 컬럼 추가
- **자동/수동 회의록**: 자동 모드 — 회의 시작 시 전체 오디오 녹음 시작, 종료 시 Whisper STT → GPT로 구조화된 회의록 자동 생성. 수동 모드 — 필요 구간만 녹음 시작/정지 반복, 회의록 작성 버튼으로 클립 합산 후 STT → 회의록 생성
- **카메라 토글 수정**: 1차(트랙 미존재 시 getUserMedia 획득), 2차(videoEnabled 변경 시 srcObject 재할당)
- **모바일 반응형**: 랜딩 페이지 + 프레젠테이션 페이지 전면 모바일 대응

---
