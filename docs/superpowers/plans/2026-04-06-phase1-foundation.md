# Phase 1: Foundation — Project Infrastructure Setup

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Docker PostgreSQL + FastAPI backend skeleton + React+Vite frontend with existing IIFF presentation content migrated from Next.js.

**Architecture:** Docker Compose runs PostgreSQL. FastAPI serves REST API on :8000. React+Vite serves frontend on :5173 with proxy to backend. Existing iiff-web content (animations, slides, design system) is migrated to Vite project.

**Tech Stack:** FastAPI, SQLAlchemy 2.0, Alembic, PostgreSQL 16, React 19, Vite, TypeScript, Tailwind CSS 4, GSAP, Framer Motion, React Router v7, react-i18next

---

## File Structure

### New Files — Backend

```
backend/
├── main.py                    # FastAPI app entry, CORS, router mounting
├── config.py                  # Pydantic Settings (env vars)
├── database.py                # SQLAlchemy engine + session
├── deps.py                    # Dependency injection (get_db)
├── requirements.txt           # Python dependencies
├── alembic.ini                # Alembic config
├── alembic/
│   ├── env.py                 # Alembic environment
│   └── versions/              # Migration files
├── models/
│   └── __init__.py            # Base model import
└── tests/
    ├── conftest.py            # Test fixtures (test DB, client)
    └── test_health.py         # Health check endpoint test
```

### New Files — Frontend

```
frontend/
├── index.html                 # Vite entry HTML
├── package.json               # Dependencies
├── vite.config.ts             # Vite config with proxy
├── tailwind.config.ts         # Tailwind config
├── postcss.config.mjs         # PostCSS config
├── tsconfig.json              # TypeScript config
├── tsconfig.app.json          # App-specific TS config
├── tsconfig.node.json         # Node-specific TS config
├── public/                    # Static assets (from iiff-web/public/)
│   ├── images/                # All images
│   └── docs/                  # PDF files
└── src/
    ├── main.tsx               # React entry point
    ├── App.tsx                # Root component with Router
    ├── globals.css            # Design tokens (from iiff-web)
    ├── i18n/
    │   └── index.ts           # react-i18next setup
    ├── lib/
    │   ├── fonts.ts           # Font config (adapted)
    │   ├── images.ts          # Image manifest (from iiff-web)
    │   ├── slides.ts          # Slide data (from iiff-web)
    │   └── gsap-register.ts   # GSAP plugin registration (from iiff-web)
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx     # Navigation (adapted from iiff-web)
    │   │   ├── Footer.tsx     # Footer (adapted from iiff-web)
    │   │   ├── MainLayout.tsx # Layout wrapper with Navbar+Footer
    │   │   └── SectionWrapper.tsx  # Content container (from iiff-web)
    │   ├── animation/         # All animation components (from iiff-web)
    │   │   ├── FadeUp.tsx
    │   │   ├── AnimatedCounter.tsx
    │   │   ├── GsapCounter.tsx
    │   │   ├── GsapReveal.tsx
    │   │   ├── ParallaxImage.tsx
    │   │   ├── GoldShimmer.tsx
    │   │   └── StaggerChildren.tsx
    │   ├── presentation/      # Slide viewer (from iiff-web)
    │   │   ├── PresentationShell.tsx
    │   │   ├── Slide.tsx
    │   │   └── SlideNav.tsx
    │   └── ui/                # UI components (from iiff-web)
    │       ├── HeroSection.tsx
    │       ├── GlassCard.tsx
    │       ├── StatCard.tsx
    │       ├── ProgramCard.tsx
    │       ├── ComparisonTable.tsx
    │       ├── DataTable.tsx
    │       ├── TimelineRoadmap.tsx
    │       ├── OrgChart.tsx
    │       ├── YouTubeEmbed.tsx
    │       ├── ThemeToggle.tsx
    │       └── PartDivider.tsx
    ├── pages/
    │   ├── Home/
    │   │   └── HomePage.tsx   # Main presentation (adapted from iiff-web page.tsx)
    │   ├── Presentation/
    │   │   └── PresentationPage.tsx  # Slide viewer page
    │   └── Docs/
    │       └── DocsPage.tsx   # PDF viewer page
    ├── content/
    │   └── ko/
    │       └── sections.json  # Content data (from iiff-web)
    └── messages/
        ├── en.json            # English translations (from iiff-web)
        └── ko.json            # Korean translations (from iiff-web)
```

### New Files — Root

```
docker-compose.yml             # PostgreSQL service
.env.example                   # Environment variable template
.gitignore                     # Updated for new structure
```

---

## Task 1: Docker PostgreSQL Setup

**Files:**
- Create: `docker-compose.yml`
- Create: `.env.example`
- Modify: `.gitignore`

- [ ] **Step 1: Create docker-compose.yml**

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    container_name: iiff-postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-iiff_db}
      POSTGRES_USER: ${POSTGRES_USER:-iiff_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-iiff_secret_2026}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-iiff_user} -d ${POSTGRES_DB:-iiff_db}"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  pgdata:
```

- [ ] **Step 2: Create .env.example**

```env
# .env.example
POSTGRES_DB=iiff_db
POSTGRES_USER=iiff_user
POSTGRES_PASSWORD=iiff_secret_2026
DATABASE_URL=postgresql://iiff_user:iiff_secret_2026@localhost:5432/iiff_db
```

- [ ] **Step 3: Update .gitignore**

Append to existing `.gitignore`:

```gitignore
# Environment
.env
.env.local
.env.*.local

# Python
__pycache__/
*.py[cod]
*$py.class
.venv/
venv/
*.egg-info/

# Node
node_modules/
dist/

# Next.js (legacy)
.next/

# Docker
pgdata/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Superpowers
.superpowers/
```

- [ ] **Step 4: Copy .env.example to .env**

Run:
```bash
cd c:\WORK\IIFF && cp .env.example .env
```

- [ ] **Step 5: Start PostgreSQL and verify**

Run:
```bash
cd c:\WORK\IIFF && docker compose up -d postgres
```

Wait 5 seconds, then:
```bash
docker compose exec postgres pg_isready -U iiff_user -d iiff_db
```
Expected: `/var/run/postgresql:5432 - accepting connections`

- [ ] **Step 6: Verify database access**

Run:
```bash
docker compose exec postgres psql -U iiff_user -d iiff_db -c "SELECT version();"
```
Expected: `PostgreSQL 16.x` version string

- [ ] **Step 7: Commit**

```bash
cd c:\WORK\IIFF && git add docker-compose.yml .env.example .gitignore && git commit -m "infra: add Docker PostgreSQL setup"
```

---

## Task 2: FastAPI Backend Skeleton

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/config.py`
- Create: `backend/database.py`
- Create: `backend/deps.py`
- Create: `backend/main.py`
- Create: `backend/models/__init__.py`

- [ ] **Step 1: Create requirements.txt**

```txt
# backend/requirements.txt
fastapi==0.115.12
uvicorn[standard]==0.34.2
sqlalchemy==2.0.40
alembic==1.15.2
psycopg2-binary==2.9.10
pydantic-settings==2.9.1
python-dotenv==1.1.0
bcrypt==4.3.0
python-jose[cryptography]==3.4.0
python-multipart==0.0.20
httpx==0.28.1
pytest==8.3.5
pytest-asyncio==0.25.3
```

- [ ] **Step 2: Create Python virtual environment and install dependencies**

Run:
```bash
cd c:\WORK\IIFF/backend && python -m venv .venv && .venv/Scripts/pip install -r requirements.txt
```
Expected: All packages install without errors.

- [ ] **Step 3: Create config.py**

```python
# backend/config.py
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://iiff_user:iiff_secret_2026@localhost:5432/iiff_db"
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    google_client_id: str = ""
    google_client_secret: str = ""
    storage_base_path: str = "D:/DATA/iiff-uploads"
    allowed_origins: list[str] = ["http://localhost:5173"]

    model_config = {"env_file": "../.env", "extra": "ignore"}


settings = Settings()
```

- [ ] **Step 4: Create database.py**

```python
# backend/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from config import settings

engine = create_engine(settings.database_url, echo=False)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    pass
```

- [ ] **Step 5: Create deps.py**

```python
# backend/deps.py
from collections.abc import Generator

from sqlalchemy.orm import Session

from database import SessionLocal


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

- [ ] **Step 6: Create models/__init__.py**

```python
# backend/models/__init__.py
from database import Base
```

- [ ] **Step 7: Create main.py**

```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings

app = FastAPI(title="IIFF API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "iiff-api"}
```

- [ ] **Step 8: Verify backend starts**

Run:
```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m uvicorn main:app --port 8000
```
Expected: `Uvicorn running on http://127.0.0.1:8000`

In another terminal:
```bash
curl http://localhost:8000/api/health
```
Expected: `{"status":"ok","service":"iiff-api"}`

Stop the server (Ctrl+C).

- [ ] **Step 9: Commit**

```bash
cd c:\WORK\IIFF && git add backend/ && git commit -m "feat(backend): add FastAPI skeleton with health check"
```

---

## Task 3: Backend Tests Setup

**Files:**
- Create: `backend/tests/__init__.py`
- Create: `backend/tests/conftest.py`
- Create: `backend/tests/test_health.py`

- [ ] **Step 1: Create tests/__init__.py**

```python
# backend/tests/__init__.py
```

- [ ] **Step 2: Create conftest.py with test client**

```python
# backend/tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base
from deps import get_db
from main import app

SQLALCHEMY_TEST_URL = "sqlite:///./test.db"

engine_test = create_engine(SQLALCHEMY_TEST_URL, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(bind=engine_test, autocommit=False, autoflush=False)


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)


@pytest.fixture()
def db_session():
    session = TestSessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()


@pytest.fixture()
def client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
```

- [ ] **Step 3: Write health check test**

```python
# backend/tests/test_health.py
def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "iiff-api"
```

- [ ] **Step 4: Run tests**

Run:
```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/ -v
```
Expected: `test_health_check PASSED` — 1 passed, 0 failed.

- [ ] **Step 5: Commit**

```bash
cd c:\WORK\IIFF && git add backend/tests/ && git commit -m "test(backend): add test infrastructure and health check test"
```

---

## Task 4: Alembic Migration Setup

**Files:**
- Create: `backend/alembic.ini`
- Create: `backend/alembic/env.py`
- Create: `backend/alembic/script.py.mako`
- Create: `backend/alembic/versions/` (empty directory)

- [ ] **Step 1: Initialize Alembic**

Run:
```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m alembic init alembic
```
Expected: Creates `alembic/` directory and `alembic.ini`.

- [ ] **Step 2: Update alembic.ini — set sqlalchemy.url**

In `backend/alembic.ini`, find the line:
```
sqlalchemy.url = driver://user:pass@localhost/dbname
```
Replace with:
```
sqlalchemy.url = postgresql://iiff_user:iiff_secret_2026@localhost:5432/iiff_db
```

- [ ] **Step 3: Update alembic/env.py to import models**

Replace the contents of `backend/alembic/env.py` with:

```python
# backend/alembic/env.py
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from database import Base

# Alembic Config object
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

- [ ] **Step 4: Verify Alembic connects to DB**

Run (PostgreSQL must be running):
```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m alembic current
```
Expected: No errors, shows current revision (empty if no migrations yet).

- [ ] **Step 5: Commit**

```bash
cd c:\WORK\IIFF && git add backend/alembic.ini backend/alembic/ && git commit -m "infra(backend): add Alembic migration setup"
```

---

## Task 5: React + Vite Frontend Skeleton

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/index.html`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/postcss.config.mjs`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tsconfig.app.json`
- Create: `frontend/tsconfig.node.json`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/globals.css`
- Create: `frontend/src/vite-env.d.ts`

- [ ] **Step 1: Create Vite project**

Run:
```bash
cd c:\WORK\IIFF && npm create vite@latest frontend -- --template react-ts
```
Expected: Creates `frontend/` directory with Vite + React + TypeScript template.

- [ ] **Step 2: Install dependencies**

Run:
```bash
cd c:\WORK\IIFF/frontend && npm install react-router-dom@7 gsap @gsap/react framer-motion react-i18next i18next i18next-browser-languagedetector axios && npm install -D tailwindcss@4 @tailwindcss/postcss postcss @types/node
```
Expected: All packages install without errors.

- [ ] **Step 3: Create postcss.config.mjs**

```javascript
// frontend/postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 4: Update vite.config.ts with proxy and path alias**

Replace `frontend/vite.config.ts` with:

```typescript
// frontend/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/ws": {
        target: "http://localhost:8000",
        ws: true,
      },
    },
  },
});
```

- [ ] **Step 5: Update tsconfig.json for path alias**

Replace `frontend/tsconfig.json` with:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Ensure `frontend/tsconfig.app.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 6: Create minimal src/globals.css with Tailwind import**

```css
/* frontend/src/globals.css */
@import "tailwindcss";

/* IIFF Design Tokens — migrated from iiff-web/src/app/globals.css */
:root {
  --color-gold: #c9a96e;
  --color-gold-light: #e0c992;
  --color-gold-dark: #a07c3f;
  --color-gold-muted: rgba(201, 169, 110, 0.15);
}

/* Dark theme (default) */
html {
  color-scheme: dark;
}

body {
  background-color: #05050a;
  color: #f0f0f5;
  font-family: "Inter", "Noto Sans KR", sans-serif;
}

/* Light theme */
[data-theme="light"] body {
  background-color: #fafaf5;
  color: #1a1a2e;
}

/* Utility classes */
.heading-display {
  font-family: "Playfair Display", serif;
  font-weight: 700;
}

.text-gold {
  color: var(--color-gold);
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  z-index: 100;
}
.skip-link:focus {
  top: 0;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 7: Create src/main.tsx**

```tsx
// frontend/src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

- [ ] **Step 8: Create src/App.tsx**

```tsx
// frontend/src/App.tsx
import { Routes, Route } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="heading-display text-5xl text-gold mb-4">IIFF</h1>
        <p className="text-lg text-gray-400">
          Incheon International Film Festival — NextWave
        </p>
        <p className="mt-8 text-sm text-gray-500">
          Platform is being set up...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
```

- [ ] **Step 9: Update index.html**

Replace `frontend/index.html` with:

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IIFF — Incheon International Film Festival</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 10: Verify frontend starts**

Run:
```bash
cd c:\WORK\IIFF/frontend && npm run dev
```
Expected: `Local: http://localhost:5173/` — browser shows IIFF title with gold color on dark background.

- [ ] **Step 11: Verify API proxy works**

Start backend in one terminal:
```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m uvicorn main:app --port 8000
```

With frontend running, open browser to `http://localhost:5173/api/health`.
Expected: `{"status":"ok","service":"iiff-api"}`

- [ ] **Step 12: Commit**

```bash
cd c:\WORK\IIFF && git add frontend/ && git commit -m "feat(frontend): add React+Vite skeleton with Tailwind and IIFF design tokens"
```

---

## Task 6: i18n Setup (react-i18next)

**Files:**
- Create: `frontend/src/i18n/index.ts`
- Copy: `iiff-web/src/messages/en.json` → `frontend/src/messages/en.json`
- Copy: `iiff-web/src/messages/ko.json` → `frontend/src/messages/ko.json`
- Modify: `frontend/src/main.tsx`

- [ ] **Step 1: Copy translation files from iiff-web**

Run:
```bash
mkdir -p c:\WORK\IIFF/frontend/src/messages && cp c:\WORK\IIFF/iiff-web/src/messages/en.json c:\WORK\IIFF/frontend/src/messages/en.json && cp c:\WORK\IIFF/iiff-web/src/messages/ko.json c:\WORK\IIFF/frontend/src/messages/ko.json
```

- [ ] **Step 2: Create i18n/index.ts**

```typescript
// frontend/src/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../messages/en.json";
import ko from "../messages/ko.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
    },
    fallbackLng: "ko",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

- [ ] **Step 3: Import i18n in main.tsx**

Add to the top of `frontend/src/main.tsx` (after other imports):

```tsx
import "./i18n";
```

- [ ] **Step 4: Verify i18n loads without errors**

Run:
```bash
cd c:\WORK\IIFF/frontend && npm run dev
```
Expected: No console errors. Page renders normally.

- [ ] **Step 5: Commit**

```bash
cd c:\WORK\IIFF && git add frontend/src/i18n/ frontend/src/messages/ frontend/src/main.tsx && git commit -m "feat(frontend): add react-i18next with EN/KO translations"
```

---

## Task 7: Migrate Static Assets from iiff-web

**Files:**
- Copy: `iiff-web/public/images/` → `frontend/public/images/`
- Copy: `iiff-web/public/docs/` → `frontend/public/docs/`
- Copy: `iiff-web/src/lib/images.ts` → `frontend/src/lib/images.ts`
- Copy: `iiff-web/src/lib/slides.ts` → `frontend/src/lib/slides.ts`
- Copy: `iiff-web/src/lib/gsap-register.ts` → `frontend/src/lib/gsap-register.ts`
- Copy: `iiff-web/src/content/` → `frontend/src/content/`

- [ ] **Step 1: Copy public assets**

Run:
```bash
mkdir -p c:\WORK\IIFF/frontend/public/images c:\WORK\IIFF/frontend/public/docs && cp -r c:\WORK\IIFF/iiff-web/public/images/* c:\WORK\IIFF/frontend/public/images/ 2>/dev/null; cp -r c:\WORK\IIFF/iiff-web/public/docs/* c:\WORK\IIFF/frontend/public/docs/ 2>/dev/null; echo "Assets copied"
```

- [ ] **Step 2: Copy lib files**

Run:
```bash
mkdir -p c:\WORK\IIFF/frontend/src/lib && cp c:\WORK\IIFF/iiff-web/src/lib/images.ts c:\WORK\IIFF/frontend/src/lib/images.ts && cp c:\WORK\IIFF/iiff-web/src/lib/slides.ts c:\WORK\IIFF/frontend/src/lib/slides.ts && cp c:\WORK\IIFF/iiff-web/src/lib/gsap-register.ts c:\WORK\IIFF/frontend/src/lib/gsap-register.ts
```

- [ ] **Step 3: Copy content data**

Run:
```bash
mkdir -p c:\WORK\IIFF/frontend/src/content/ko && cp c:\WORK\IIFF/iiff-web/src/content/ko/sections.json c:\WORK\IIFF/frontend/src/content/ko/sections.json
```

- [ ] **Step 4: Adapt images.ts — remove Next.js Image imports if any**

Read `frontend/src/lib/images.ts` and remove any `import ... from 'next/image'` references. The file should export plain object/array with image paths as strings. If it uses `/images/...` paths, they work as-is with Vite's `public/` directory.

- [ ] **Step 5: Adapt gsap-register.ts — remove Next.js-specific code**

Read `frontend/src/lib/gsap-register.ts`. Remove any `'use client'` directives. The GSAP registration logic itself should work unchanged:

```typescript
// frontend/src/lib/gsap-register.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
```

- [ ] **Step 6: Verify no import errors**

Run:
```bash
cd c:\WORK\IIFF/frontend && npx tsc --noEmit
```
Expected: No type errors (or only minor ones to fix in next steps).

- [ ] **Step 7: Commit**

```bash
cd c:\WORK\IIFF && git add frontend/public/ frontend/src/lib/ frontend/src/content/ && git commit -m "feat(frontend): migrate static assets, lib, and content from iiff-web"
```

---

## Task 8: Migrate Animation Components

**Files:**
- Copy and adapt 7 animation components from `iiff-web/src/components/animation/`

- [ ] **Step 1: Copy animation components**

Run:
```bash
mkdir -p c:\WORK\IIFF/frontend/src/components/animation && cp c:\WORK\IIFF/iiff-web/src/components/animation/*.tsx c:\WORK\IIFF/frontend/src/components/animation/
```

- [ ] **Step 2: Remove Next.js directives from all files**

For each `.tsx` file in `frontend/src/components/animation/`:
- Remove `'use client'` directive at the top (if present)
- Replace any `import Image from 'next/image'` with standard `<img>` usage
- Replace any `import Link from 'next/link'` with `import { Link } from 'react-router-dom'`

These components (FadeUp, AnimatedCounter, GsapCounter, GsapReveal, ParallaxImage, GoldShimmer, StaggerChildren) are React components using GSAP/Framer Motion — the core logic stays unchanged.

- [ ] **Step 3: Verify TypeScript compilation**

Run:
```bash
cd c:\WORK\IIFF/frontend && npx tsc --noEmit
```
Fix any type errors that arise from the migration.

- [ ] **Step 4: Commit**

```bash
cd c:\WORK\IIFF && git add frontend/src/components/animation/ && git commit -m "feat(frontend): migrate animation components from iiff-web"
```

---

## Task 9: Migrate UI Components

**Files:**
- Copy and adapt 11 UI components from `iiff-web/src/components/ui/`
- Copy layout components from `iiff-web/src/components/layout/`
- Copy presentation components from `iiff-web/src/components/presentation/`

- [ ] **Step 1: Copy all component directories**

Run:
```bash
mkdir -p c:\WORK\IIFF/frontend/src/components/ui c:\WORK\IIFF/frontend/src/components/layout c:\WORK\IIFF/frontend/src/components/presentation && cp c:\WORK\IIFF/iiff-web/src/components/ui/*.tsx c:\WORK\IIFF/frontend/src/components/ui/ 2>/dev/null; cp c:\WORK\IIFF/iiff-web/src/components/layout/*.tsx c:\WORK\IIFF/frontend/src/components/layout/ 2>/dev/null; cp c:\WORK\IIFF/iiff-web/src/components/presentation/*.tsx c:\WORK\IIFF/frontend/src/components/presentation/ 2>/dev/null; echo "Components copied"
```

- [ ] **Step 2: Adapt all components — systematic Next.js removal**

For every `.tsx` file in `ui/`, `layout/`, `presentation/`:

1. Remove `'use client'` directive
2. Replace `import Image from 'next/image'` → use `<img>` with `loading="lazy"`
3. Replace `import Link from 'next/link'` → `import { Link } from 'react-router-dom'`
4. Replace `<Link href=` → `<Link to=`
5. Replace `import { useRouter } from 'next/navigation'` → `import { useNavigate } from 'react-router-dom'` and `router.push(x)` → `navigate(x)`
6. Replace `import { useTranslations } from 'next-intl'` → `import { useTranslation } from 'react-i18next'` and `const t = useTranslations('key')` → `const { t } = useTranslation()`
7. Replace `<Image src=` → `<img src=` with appropriate attributes

- [ ] **Step 3: Verify TypeScript compilation**

Run:
```bash
cd c:\WORK\IIFF/frontend && npx tsc --noEmit
```
Fix remaining type errors.

- [ ] **Step 4: Commit**

```bash
cd c:\WORK\IIFF && git add frontend/src/components/ && git commit -m "feat(frontend): migrate UI, layout, and presentation components from iiff-web"
```

---

## Task 10: Migrate Main Page Content

**Files:**
- Create: `frontend/src/pages/Home/HomePage.tsx`
- Create: `frontend/src/pages/Presentation/PresentationPage.tsx`
- Create: `frontend/src/pages/Docs/DocsPage.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Create pages directory structure**

Run:
```bash
mkdir -p c:\WORK\IIFF/frontend/src/pages/Home c:\WORK\IIFF/frontend/src/pages/Presentation c:\WORK\IIFF/frontend/src/pages/Docs
```

- [ ] **Step 2: Create HomePage.tsx — migrate from iiff-web page.tsx**

Copy `iiff-web/src/app/page.tsx` to `frontend/src/pages/Home/HomePage.tsx` and apply the same Next.js → React adaptations from Task 9 Step 2. This is a large file (~1520 lines). Key changes:

1. Remove `'use client'` and any Next.js metadata exports
2. Convert all imports (Image, Link, useRouter, useTranslations)
3. Replace `export default function Page()` → `export default function HomePage()`
4. The component body (JSX) stays largely unchanged

- [ ] **Step 3: Create PresentationPage.tsx**

Copy `iiff-web/src/app/presentation/page.tsx` and apply same adaptations.

- [ ] **Step 4: Create DocsPage.tsx**

Copy `iiff-web/src/app/docs/page.tsx` and apply same adaptations. The PDF iframe viewer should work with `/docs/IIFF_Final_Plan.pdf` path unchanged.

- [ ] **Step 5: Create MainLayout component**

```tsx
// frontend/src/components/layout/MainLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 6: Update App.tsx with routes**

```tsx
// frontend/src/App.tsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/pages/Home/HomePage";
import PresentationPage from "@/pages/Presentation/PresentationPage";
import DocsPage from "@/pages/Docs/DocsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/presentation" element={<PresentationPage />} />
        <Route path="/docs" element={<DocsPage />} />
      </Route>
    </Routes>
  );
}
```

- [ ] **Step 7: Verify full site renders**

Run:
```bash
cd c:\WORK\IIFF/frontend && npm run dev
```
Expected: `http://localhost:5173/` shows the full IIFF presentation with all 5 parts, animations, and gold theme. Navigation between `/`, `/presentation`, `/docs` works.

- [ ] **Step 8: Commit**

```bash
cd c:\WORK\IIFF && git add frontend/src/pages/ frontend/src/App.tsx frontend/src/components/layout/MainLayout.tsx && git commit -m "feat(frontend): migrate full presentation content with routing"
```

---

## Task 11: DB Connection Verification Test

**Files:**
- Create: `backend/tests/test_database.py`

- [ ] **Step 1: Write DB connection test**

```python
# backend/tests/test_database.py
from sqlalchemy import text

from database import engine


def test_database_connection():
    """Verify we can connect to PostgreSQL and run a query."""
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        assert result.scalar() == 1
```

- [ ] **Step 2: Run test (PostgreSQL must be running)**

Run:
```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/test_database.py -v
```
Expected: `test_database_connection PASSED`

- [ ] **Step 3: Run all tests**

Run:
```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/ -v
```
Expected: 2 passed (health + database), 0 failed.

- [ ] **Step 4: Commit**

```bash
cd c:\WORK\IIFF && git add backend/tests/test_database.py && git commit -m "test(backend): add database connection verification test"
```

---

## Task 12: Frontend Build Verification

**Files:** None (verification only)

- [ ] **Step 1: Run production build**

Run:
```bash
cd c:\WORK\IIFF/frontend && npm run build
```
Expected: Build completes without errors. Output in `frontend/dist/`.

- [ ] **Step 2: Preview production build**

Run:
```bash
cd c:\WORK\IIFF/frontend && npm run preview
```
Expected: `http://localhost:4173/` serves the production build. All pages render correctly.

- [ ] **Step 3: Run type check**

Run:
```bash
cd c:\WORK\IIFF/frontend && npx tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 4: Commit any remaining fixes**

```bash
cd c:\WORK\IIFF && git add -A && git commit -m "fix(frontend): resolve build and type errors from migration"
```

---

## Task 13: Final Integration Verification

**Files:** None (verification only)

- [ ] **Step 1: Start all services**

Terminal 1:
```bash
cd c:\WORK\IIFF && docker compose up -d postgres
```

Terminal 2:
```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m uvicorn main:app --port 8000 --reload
```

Terminal 3:
```bash
cd c:\WORK\IIFF/frontend && npm run dev
```

- [ ] **Step 2: Verify checklist**

Open `http://localhost:5173/` and verify:

- [ ] Main page loads with IIFF presentation content
- [ ] Dark theme with gold (#c9a96e) accents
- [ ] GSAP/Framer Motion animations play
- [ ] Navigation between sections works
- [ ] `/presentation` slide viewer works
- [ ] `/docs` PDF viewer works
- [ ] `/api/health` returns `{"status":"ok"}`
- [ ] Fonts load (Playfair Display, Inter, Noto Sans KR)
- [ ] No console errors

- [ ] **Step 3: Run all backend tests**

```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/ -v
```
Expected: All tests pass.

- [ ] **Step 4: Final commit**

```bash
cd c:\WORK\IIFF && git add -A && git commit -m "feat: complete Phase 1 — foundation infrastructure setup"
```

---

## Summary

After Phase 1 completion:
- Docker PostgreSQL running and accessible
- FastAPI backend with health check + test suite
- React+Vite frontend with full IIFF presentation migrated from Next.js
- Tailwind CSS 4 with IIFF design tokens (dark theme, gold accents, glassmorphism)
- GSAP + Framer Motion animations preserved
- react-i18next with EN/KO translations
- React Router with 3 routes (Home, Presentation, Docs)
- Alembic ready for database migrations
- API proxy configured (frontend :5173 → backend :8000)

**Next:** Phase 2 — Authentication System (Google OAuth + Local Signup + Admin Approval)
