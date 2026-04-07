# IIFF 프로젝트 버그수정 로그

| 날짜 | 버그 설명 | 원인 | 수정 내용 | 관련 파일 |
|------|----------|------|----------|----------|
| 2026-04-06 | TypeScript 6 빌드 에러 | TS 6.0.2 + Vite 8 composite 모드 호환성 | tsconfig.app.json 사용으로 우회 | frontend/tsconfig*.json |
| 2026-04-06 | SuperAdmin 시드 스크립트 Unicode 에러 | Windows cp949 인코딩에서 emoji 출력 실패 | emoji를 [!] 텍스트로 교체 | backend/scripts/seed_admin.py |
| 2026-04-06 | conftest.py 모델 미임포트로 테스트 DB 테이블 미생성 | SQLite 테스트 DB가 Board/Post/Comment/File 테이블을 모름 | conftest.py에 모든 모델 import 추가 | backend/tests/conftest.py |
| 2026-04-06 | React StrictMode WebSocket 이중 연결로 채팅 안됨 | StrictMode 더블 마운트로 첫 WS가 cleanup에서 닫힘 | cancelled 플래그 패턴으로 cleanup 시 상태 업데이트 방지 | frontend/src/pages/Meeting/TextChatPage.tsx |
| 2026-04-06 | FastAPI /minutes/list가 /{meeting_id}에 매칭됨 | 정적 라우트가 동적 라우트 뒤에 등록되어 meeting_id="minutes"로 파싱 | /minutes/list, /minutes/{id} 라우트를 /{meeting_id} 앞으로 이동 | backend/routers/meetings.py |
| 2026-04-06 | 포트 8001 좀비 프로세스로 백엔드 시작 불가 | 기존 프로세스가 kill 후에도 포트를 점유 | 백엔드 포트를 8002로 변경, vite proxy 업데이트 | backend, frontend/vite.config.ts |
| 2026-04-06 | 백엔드 로그인 500 에러 | 모델/스키마 변경 후 서버 미재시작 | uvicorn 프로세스 재시작 | backend 전체 |
| 2026-04-07 | TypeScript 빌드 에러 (useRef strict mode) | TS6 strict 모드에서 useRef() 초기값 필수 | useRef(undefined)로 변경 | frontend/src/components/meeting/InviteModal.tsx |
| 2026-04-07 | TypeScript 빌드 에러 (미사용 변수) | noUnusedLocals에서 regex 변수 감지 | 미사용 regex 변수 제거 | frontend/src/pages/Meeting/MeetingMinutesDetailPage.tsx |
| 2026-04-07 | stale .d.ts 파일로 TS6305 빌드 에러 | composite 모드에서 src/에 .d.ts 생성 | declarationDir을 node_modules/.tmp로 변경 | frontend/tsconfig.app.json |
| 2026-04-07 | 배포 백엔드 SQLAlchemy mapper 에러 | MeetingInvitation/MeetingMinutes 모델 미임포트 | models/__init__.py에 import 추가 | backend/models/__init__.py |
| 2026-04-07 | 배포 DB 인증 실패 (password authentication failed) | .env의 orbitron_user와 실제 DB의 iiff_user 불일치 | .env 수정 → orbitron-iiff-db 공유로 통일 | docker-compose.yml, .env |
| 2026-04-07 | 배포 이미지 미표시 | 파일이 서버에 없고 DB에 절대경로(Windows) 저장 | 상대경로 저장 + 서버에 파일 복사 + SCP 자동 동기화 | backend/services/storage.py, backend/routers/posts.py |
| 2026-04-07 | 로컬 개발 서버 로그인 불가 | Vite 프록시 포트 8002로 잘못 설정 (백엔드는 8000) | vite.config.ts 프록시 target을 localhost:8000으로 수정 | frontend/vite.config.ts |
| 2026-04-07 | 라이트 모드 전환 시 브라우저 기본 UI 다크 유지 | color-scheme이 dark로 고정 | [data-theme="light"]에 color-scheme: light 추가 | frontend/src/globals.css |
| 2026-04-07 | 화상회의 화면이 네비게이션 바에 가려짐 | position: fixed; inset: 0이 전체 화면 점유 | top을 navbar 높이(56px/72px)로 변경 | frontend/src/pages/Meeting/VideoRoomPage.tsx, PreJoinLobby.tsx |
| 2026-04-07 | 화상회의 채팅 연결 불가 | chat.py에서 video 타입 회의를 거부 | meeting.type not in ("text", "video")로 수정 | backend/routers/chat.py |
| 2026-04-07 | 카메라 끄기 후 다시 켜기 불가 (트랙 미존재) | 카메라 없이 입장 시 video track 없음 | toggleCamera에서 getUserMedia로 새 트랙 획득 | frontend/src/hooks/useWebRTC.ts |
| 2026-04-07 | 카메라 끄기 후 다시 켜기 불가 (srcObject 미갱신) | useEffect가 [stream]만 감시, videoEnabled 변경 감지 안 됨 | dependency에 videoEnabled 추가 | VideoRoomPage.tsx, VideoTile.tsx |
| 2026-04-07 | 배포 빌드 TS 에러 (미사용 import/타입 불일치) | PeerState 미사용, handRaised 누락, 미사용 변수 | 미사용 제거, 타입 수정 | frontend/src/pages/Meeting/VideoRoomPage.tsx |
| 2026-04-07 | 멤버 초대 모달에 확인 버튼 없음 | 모달 닫기 버튼만 있고 확인 버튼 미구현 | 골드 확인 버튼 추가 | frontend/src/components/meeting/InviteModal.tsx |
