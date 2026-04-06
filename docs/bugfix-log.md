# IIFF 프로젝트 버그수정 로그

| 날짜 | 버그 설명 | 원인 | 수정 내용 | 관련 파일 |
|------|----------|------|----------|----------|
| 2026-04-06 | TypeScript 6 빌드 에러 | TS 6.0.2 + Vite 8 composite 모드 호환성 | tsconfig.app.json 사용으로 우회 | frontend/tsconfig*.json |
| 2026-04-06 | SuperAdmin 시드 스크립트 Unicode 에러 | Windows cp949 인코딩에서 emoji 출력 실패 | emoji를 [!] 텍스트로 교체 | backend/scripts/seed_admin.py |
| 2026-04-06 | conftest.py 모델 미임포트로 테스트 DB 테이블 미생성 | SQLite 테스트 DB가 Board/Post/Comment/File 테이블을 모름 | conftest.py에 모든 모델 import 추가 | backend/tests/conftest.py |
| 2026-04-06 | React StrictMode WebSocket 이중 연결로 채팅 안됨 | StrictMode 더블 마운트로 첫 WS가 cleanup에서 닫힘 | cancelled 플래그 패턴으로 cleanup 시 상태 업데이트 방지 | frontend/src/pages/Meeting/TextChatPage.tsx |
| 2026-04-06 | FastAPI /minutes/list가 /{meeting_id}에 매칭됨 | 정적 라우트가 동적 라우트 뒤에 등록되어 meeting_id="minutes"로 파싱 | /minutes/list, /minutes/{id} 라우트를 /{meeting_id} 앞으로 이동 | backend/routers/meetings.py |
| 2026-04-06 | 포트 8001 좀비 프로세스로 백엔드 시작 불가 | 기존 프로세스가 kill 후에도 포트를 점유 | 백엔드 포트를 8002로 변경, vite proxy 업데이트 | backend, frontend/vite.config.ts |
