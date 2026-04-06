# IIFF 프로젝트 버그수정 로그

| 날짜 | 버그 설명 | 원인 | 수정 내용 | 관련 파일 |
|------|----------|------|----------|----------|
| 2026-04-06 | TypeScript 6 빌드 에러 | TS 6.0.2 + Vite 8 composite 모드 호환성 | tsconfig.app.json 사용으로 우회 | frontend/tsconfig*.json |
| 2026-04-06 | SuperAdmin 시드 스크립트 Unicode 에러 | Windows cp949 인코딩에서 emoji 출력 실패 | emoji를 [!] 텍스트로 교체 | backend/scripts/seed_admin.py |
| 2026-04-06 | conftest.py 모델 미임포트로 테스트 DB 테이블 미생성 | SQLite 테스트 DB가 Board/Post/Comment/File 테이블을 모름 | conftest.py에 모든 모델 import 추가 | backend/tests/conftest.py |
