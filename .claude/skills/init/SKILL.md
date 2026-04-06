---
name: init
description: IIFF 프로젝트 초기 세팅 - Next.js 웹앱, i18n(EN/KO), Tailwind CSS, GSAP/Framer Motion 애니메이션, 프로젝트 문서 자동 생성
user-invocable: true
---

# IIFF 프로젝트 초기 세팅

Incheon International Film Festival (NextWave) 프로젝트를 처음 시작할 때 이 스킬을 실행하면 모든 기본 구조를 자동으로 생성합니다.

**포함 기능:**
- Next.js 16 기반 웹사이트 (App Router)
- 다국어 지원 (EN/KO) - next-intl
- Tailwind CSS 4 스타일링
- GSAP + Framer Motion 시네마틱 애니메이션
- 다크/라이트 테마 지원 (next-themes)
- 프레젠테이션 뷰어 (슬라이드 기반)
- 프로젝트 문서 시스템

---

## 1단계: Git 초기화

```bash
cd c:\WORK\IIFF && git init -b main
```

## 2단계: .gitignore 생성

`c:\WORK\IIFF\.gitignore` 파일을 생성합니다:

```gitignore
# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
.next/
out/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
desktop.ini

# Build
dist/
build/

# Logs
*.log
```

## 3단계: 프로젝트 디렉토리 구조 생성

```
c:\WORK\IIFF\
├── iiff-web/                    # Next.js 웹앱
│   ├── src/
│   │   ├── app/                 # App Router 페이지
│   │   │   └── [locale]/       # i18n 라우트 그룹
│   │   ├── components/          # React 컴포넌트
│   │   │   ├── animation/      # GSAP/Framer Motion 애니메이션
│   │   │   ├── layout/         # 레이아웃 (Header, Footer, Navigation)
│   │   │   ├── presentation/   # 슬라이드/프레젠테이션 뷰어
│   │   │   └── ui/             # 공통 UI 컴포넌트
│   │   ├── content/             # 콘텐츠 데이터 (en/, ko/)
│   │   ├── i18n/               # i18n 설정
│   │   ├── lib/                # 유틸리티, 헬퍼
│   │   └── messages/           # 번역 메시지 파일
│   ├── public/                  # 정적 파일 (이미지 등)
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
├── Sorces/                      # 기획 문서, PDF, 원본 자료
├── docs/                        # 프로젝트 문서
│   ├── dev-plan.md
│   ├── bugfix-log.md
│   ├── upgrade-log.md
│   └── work-log.md
├── .gitignore
└── CLAUDE.md
```

### 디렉토리 생성 명령:

```bash
cd c:\WORK\IIFF && mkdir -p iiff-web/src/app iiff-web/src/components/animation iiff-web/src/components/layout iiff-web/src/components/presentation iiff-web/src/components/ui iiff-web/src/content/en iiff-web/src/content/ko iiff-web/src/i18n iiff-web/src/lib iiff-web/src/messages iiff-web/public docs Sorces
```

## 4단계: Next.js 프로젝트 생성

```bash
cd c:\WORK\IIFF/iiff-web && npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --use-npm
```

### 추가 의존성 설치:

```bash
cd c:\WORK\IIFF/iiff-web && npm install gsap @gsap/react framer-motion next-intl next-themes
```

## 5단계: 프로젝트 문서 생성

`docs/` 디렉토리에 4개의 마크다운 문서를 생성합니다:

### docs/dev-plan.md
IIFF NextWave 웹사이트 개발계획서 - 마일스톤, 기능 목록, 일정

### docs/work-log.md
작업일지 - 일별 작업 내역 기록

### docs/bugfix-log.md
버그수정 로그 테이블

### docs/upgrade-log.md
업그레이드/기능추가 로그 테이블

## 6단계: CLAUDE.md 생성

프로젝트 루트에 CLAUDE.md를 생성합니다. 포함 내용:
- 프로젝트 개요 (IIFF - Incheon International Film Festival NextWave)
- 기술 스택 (Next.js 16, React 19, Tailwind CSS 4, GSAP, Framer Motion, next-intl, TypeScript)
- 프로젝트 구조 설명
- 개발 명령어 (`npm run dev`, `npm run build`, `npm run lint`)
- 디자인 시스템 (시네마틱/프리미엄 다크 테마, 글래스모피즘)
- i18n 규칙 (EN/KO 동시 지원)

## 7단계: 초기 커밋

```bash
cd c:\WORK\IIFF && git add -A && git commit -m "feat: IIFF NextWave 프로젝트 초기 세팅"
```

## 8단계: GitHub 리포지토리 생성 + 푸시

```bash
cd c:\WORK\IIFF && gh repo create IIFF --public --source=. --push
```
