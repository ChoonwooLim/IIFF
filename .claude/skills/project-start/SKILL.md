---
name: project-start
description: IIFF 원스톱 프로젝트 부트스트랩 - "project start" 입력 시 /init → MCP 세팅 → /end 까지 자동 실행
user-invocable: true
---

# IIFF 원스톱 프로젝트 부트스트랩

사용자가 "project start"를 입력하면 아래 전체 파이프라인을 자동으로 실행합니다.
**중간에 사용자 입력 없이 끝까지 완주합니다.**

---

## 전체 흐름

```
project start
  ├── Phase 1: 환경 사전 점검
  ├── Phase 2: /init 실행 (프로젝트 구조 + 코드 + GitHub)
  ├── Phase 3: MCP 서버 설정
  ├── Phase 4: Frontend 의존성 설치
  ├── Phase 5: /end 실행 (문서 업데이트 + 커밋 + 푸시)
  └── Phase 6: 최종 보고
```

---

## Phase 1: 환경 사전 점검

아래 도구들이 설치되어 있는지 확인합니다. 없으면 사용자에게 안내 후 중단합니다.

```bash
git --version && gh auth status && node --version && npm --version
```

### 필수 도구 목록

| 도구 | 확인 명령 | 미설치 시 안내 |
|------|----------|---------------|
| Git | `git --version` | `winget install Git.Git` |
| GitHub CLI | `gh auth status` | `winget install GitHub.cli` → `gh auth login` |
| Node.js | `node --version` | `winget install OpenJS.NodeJS.LTS` |

→ 하나라도 없으면 설치 안내 메시지를 출력하고 **중단**합니다.
→ 모두 있으면 다음 단계로 진행합니다.

## Phase 2: /init 실행

`/init` 스킬의 모든 단계를 순서대로 실행합니다:

1. Git 초기화
2. .gitignore 생성
3. 프로젝트 디렉토리 구조 생성
4. Next.js 프로젝트 생성 + 의존성 설치
5. 프로젝트 문서 생성 (docs/ 4개 마크다운)
6. CLAUDE.md 생성
7. 초기 커밋
8. GitHub 리포지토리 생성 + 푸시

**`/init` 스킬의 모든 단계를 그대로 따릅니다.**

## Phase 3: MCP 서버 설정

프로젝트 `.claude/settings.local.json`에 MCP 서버를 설정합니다.
기존 설정(permissions 등)은 유지하면서 `mcpServers` 키를 추가/병합합니다.

### 설정할 MCP 서버

아래 내용을 `.claude/settings.local.json`의 `mcpServers` 키에 추가합니다:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<gh auth token 자동 삽입>"
      }
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "<프로젝트 루트 경로>"]
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    }
  }
}
```

### MCP 설정 자동화 규칙

1. **github**: `gh auth token` 명령으로 토큰을 자동 추출하여 삽입
2. **filesystem**: 현재 프로젝트 루트 절대 경로를 자동 삽입
3. **나머지**: 추가 설정 없이 바로 사용 가능

### MCP 서버 설명

| # | 서버 | 용도 | API 키 필요 |
|---|------|------|------------|
| 1 | **Context7** | 라이브러리 최신 문서 조회 (Next.js, React, GSAP 등) | 없음 |
| 2 | **GitHub** | Issue, PR, 리포지토리 관리 | gh auth 토큰 |
| 3 | **Puppeteer** | 브라우저 자동화, 스크린샷, 테스트 | 없음 |
| 4 | **Sequential Thinking** | 복잡한 문제 단계별 추론 | 없음 |
| 5 | **Memory** | 지식 그래프 기반 장기 기억 | 없음 |
| 6 | **Filesystem** | 확장 파일 시스템 조작 | 없음 |
| 7 | **Fetch** | 외부 HTTP API 호출 | 없음 |

## Phase 4: Frontend 의존성 설치

`/init`에서 `npm install`이 이미 실행되었으므로, 누락된 경우에만 재실행:

```bash
cd c:\WORK\IIFF/iiff-web && npm install
```

## Phase 5: /end 실행

`/end` 스킬을 실행합니다:

1. 세션 작업 내역 수집 (git status + git log)
2. docs/ 문서 자동 업데이트 (work-log.md에 초기 세팅 기록)
3. Git 커밋 & 푸시
4. 세션 종료 보고 생성

**`/end` 스킬의 모든 단계를 그대로 따릅니다.**

## Phase 6: 최종 보고

모든 단계가 완료되면 사용자에게 아래 형식으로 최종 보고합니다:

```
## 프로젝트 부트스트랩 완료

### 생성된 프로젝트
- 이름: IIFF (Incheon International Film Festival NextWave)
- GitHub: (리포지토리 URL)
- 스택: Next.js 16 + React 19 + Tailwind CSS 4 + GSAP + Framer Motion + TypeScript

### 환경 상태
| 항목 | 상태 |
|------|------|
| Git 초기화 | 완료 |
| GitHub 리포지토리 | public, 푸시 완료 |
| Frontend (node_modules) | 설치 완료 |
| MCP 서버 (7개) | 설정 완료 |
| 프로젝트 문서 (4개) | 생성 완료 |
| i18n (EN/KO) | 설정 완료 |

### MCP 서버 현황
| 서버 | 상태 |
|------|------|
| context7 | 설정 완료 |
| github | 설정 완료 |
| puppeteer | 설정 완료 |
| sequential-thinking | 설정 완료 |
| memory | 설정 완료 |
| filesystem | 설정 완료 |
| fetch | 설정 완료 |

### 다음 필수 작업
1. 로컬 테스트 실행: `cd iiff-web && npm run dev`
2. 브라우저에서 http://localhost:3000 접속 확인
3. `docs/dev-plan.md` 개발계획서 작성
4. 콘텐츠 데이터 추가 (src/content/en/, src/content/ko/)
5. 프레젠테이션 슬라이드 콘텐츠 구성
```

---

## 에러 처리

각 Phase에서 에러가 발생하면:

1. **Phase 1 실패** (도구 미설치): 설치 안내 출력 후 **중단**
2. **Phase 2 실패** (init): 에러 내용 출력, 수동 복구 안내 후 **중단**
3. **Phase 3 실패** (MCP): 실패한 서버만 건너뛰고 **계속 진행**
4. **Phase 4 실패** (npm): 에러 출력, `package.json` 확인 안내 후 **계속 진행**
5. **Phase 5 실패** (end): 에러 출력, 수동 커밋 안내 후 **계속 진행**

→ Phase 1~2는 치명적이므로 중단, Phase 3~5는 비치명적이므로 경고 후 계속 진행합니다.
