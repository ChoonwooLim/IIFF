# Phase 6: Deployment + Backup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Production-ready Docker Compose stack (PostgreSQL + FastAPI backend + Vite frontend + Nginx reverse proxy) with Alembic auto-migration on startup and a database backup script using pg_dump with optional rclone to Google Drive.

**Architecture:** Multi-container Docker Compose: Nginx (port 80/443) reverse-proxies to frontend (static files) and backend (API + WebSocket). Backend Dockerfile uses multi-stage build. Frontend Dockerfile builds static assets then serves via Nginx. PostgreSQL container persists to named volume. Backup script runs pg_dump and optionally syncs to Google Drive via rclone.

**Tech Stack:** Docker, Docker Compose, Nginx, Python 3.12, Node 22, PostgreSQL 16, rclone

---

## File Structure

```
project-root/
├── docker-compose.yml          # (modify) full production stack
├── docker-compose.dev.yml      # (new) development overrides
├── .env.example                # (modify) add all production env vars
├── .env.production.example     # (new) production env template
├── backend/
│   └── Dockerfile              # (new) FastAPI production image
├── frontend/
│   ├── Dockerfile              # (new) Vite build + Nginx serve
│   └── nginx.conf              # (new) frontend Nginx config
├── nginx/
│   └── nginx.conf              # (new) reverse proxy config
└── scripts/
    └── backup-db.sh            # (new) pg_dump + rclone script
```

---

## Task 1: Backend Dockerfile + Entrypoint

**Files:**
- Create: `backend/Dockerfile`
- Create: `backend/start.sh`

- [ ] **Step 1: Create backend Dockerfile**

```dockerfile
# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system deps for psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x start.sh

EXPOSE 8000

CMD ["./start.sh"]
```

- [ ] **Step 2: Create backend entrypoint script**

```bash
#!/bin/bash
# backend/start.sh
set -e

echo "[IIFF] Running Alembic migrations..."
python -m alembic upgrade head

echo "[IIFF] Starting FastAPI server..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
```

- [ ] **Step 3: Create `.dockerignore` for backend**

```
# backend/.dockerignore
.venv/
__pycache__/
*.pyc
tests/
test.db
.pytest_cache/
```

- [ ] **Step 4: Commit**

```bash
cd c:\WORK\IIFF && git add backend/Dockerfile backend/start.sh backend/.dockerignore && git commit -m "feat(backend): add Dockerfile with Alembic auto-migration entrypoint"
```

---

## Task 2: Frontend Dockerfile + Nginx Config

**Files:**
- Create: `frontend/Dockerfile`
- Create: `frontend/nginx.conf`
- Create: `frontend/.dockerignore`

- [ ] **Step 1: Create frontend Dockerfile**

```dockerfile
# frontend/Dockerfile
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

- [ ] **Step 2: Create frontend Nginx config**

```nginx
# frontend/nginx.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

- [ ] **Step 3: Create `.dockerignore` for frontend**

```
# frontend/.dockerignore
node_modules/
dist/
.vite/
```

- [ ] **Step 4: Commit**

```bash
cd c:\WORK\IIFF && git add frontend/Dockerfile frontend/nginx.conf frontend/.dockerignore && git commit -m "feat(frontend): add Dockerfile with multi-stage build and Nginx serve"
```

---

## Task 3: Nginx Reverse Proxy Config

**Files:**
- Create: `nginx/nginx.conf`

- [ ] **Step 1: Create Nginx reverse proxy config**

```nginx
# nginx/nginx.conf
upstream backend {
    server backend:8000;
}

upstream frontend {
    server frontend:80;
}

server {
    listen 80;
    server_name _;

    client_max_body_size 100M;

    # API and auth routes → backend
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket → backend
    location /ws/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400;
    }

    # Uploaded files → backend
    location /uploads/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
    }

    # Everything else → frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

- [ ] **Step 2: Commit**

```bash
cd c:\WORK\IIFF && git add nginx/nginx.conf && git commit -m "feat(nginx): add reverse proxy config with API, WebSocket, and frontend routing"
```

---

## Task 4: Docker Compose Production + Dev Override

**Files:**
- Modify: `docker-compose.yml`
- Create: `docker-compose.dev.yml`
- Modify: `.env.example`
- Create: `.env.production.example`

- [ ] **Step 1: Update docker-compose.yml for production**

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    container_name: iiff-postgres
    restart: unless-stopped
    ports:
      - "${POSTGRES_PORT:-5433}:5432"
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

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: iiff-backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-iiff_user}:${POSTGRES_PASSWORD:-iiff_secret_2026}@postgres:5432/${POSTGRES_DB:-iiff_db}
      JWT_SECRET_KEY: ${JWT_SECRET_KEY:-change-me-in-production}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID:-}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET:-}
      STORAGE_BASE_PATH: /data/uploads
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS:-http://localhost}
    volumes:
      - uploads:/data/uploads

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: iiff-frontend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: iiff-nginx
    restart: unless-stopped
    ports:
      - "${HTTP_PORT:-80}:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - backend
      - frontend

volumes:
  pgdata:
  uploads:
```

- [ ] **Step 2: Create docker-compose.dev.yml**

This overrides for local development — no backend/frontend/nginx containers, just PostgreSQL.

```yaml
# docker-compose.dev.yml
# Usage: docker compose -f docker-compose.dev.yml up -d
# Starts only PostgreSQL for local development
services:
  postgres:
    image: postgres:16-alpine
    container_name: iiff-postgres
    restart: unless-stopped
    ports:
      - "5433:5432"
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

- [ ] **Step 3: Update .env.example**

```env
# Database
POSTGRES_DB=iiff_db
POSTGRES_USER=iiff_user
POSTGRES_PASSWORD=iiff_secret_2026
POSTGRES_PORT=5433
DATABASE_URL=postgresql://iiff_user:iiff_secret_2026@localhost:5433/iiff_db

# Auth
JWT_SECRET_KEY=change-me-in-production
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Server
ALLOWED_ORIGINS=http://localhost:5173
HTTP_PORT=80

# File storage
STORAGE_BASE_PATH=D:/DATA/iiff-uploads

# Backup (optional)
BACKUP_DIR=./backups
RCLONE_REMOTE=gdrive:iiff-backups
```

- [ ] **Step 4: Create .env.production.example**

```env
# Database
POSTGRES_DB=iiff_db
POSTGRES_USER=iiff_user
POSTGRES_PASSWORD=CHANGE_ME_STRONG_PASSWORD
POSTGRES_PORT=5433
DATABASE_URL=postgresql://iiff_user:CHANGE_ME_STRONG_PASSWORD@postgres:5432/iiff_db

# Auth
JWT_SECRET_KEY=CHANGE_ME_RANDOM_SECRET_KEY
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server
ALLOWED_ORIGINS=https://iiff.twinverse.org
HTTP_PORT=80

# File storage (container path)
STORAGE_BASE_PATH=/data/uploads

# Backup
BACKUP_DIR=/backups
RCLONE_REMOTE=gdrive:iiff-backups
```

- [ ] **Step 5: Commit**

```bash
cd c:\WORK\IIFF && git add docker-compose.yml docker-compose.dev.yml .env.example .env.production.example && git commit -m "feat: add Docker Compose production stack with dev override"
```

---

## Task 5: Database Backup Script

**Files:**
- Create: `scripts/backup-db.sh`

- [ ] **Step 1: Create backup script**

```bash
#!/bin/bash
# scripts/backup-db.sh
# Usage: ./scripts/backup-db.sh [--rclone]
#
# Performs pg_dump of the IIFF database.
# With --rclone flag, syncs backup to Google Drive via rclone.
#
# Prerequisites:
#   - Docker running with iiff-postgres container
#   - rclone configured (optional, for cloud sync)
#
# Environment variables (from .env):
#   POSTGRES_DB, POSTGRES_USER, BACKUP_DIR, RCLONE_REMOTE

set -e

# Load env if available
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

DB_NAME="${POSTGRES_DB:-iiff_db}"
DB_USER="${POSTGRES_USER:-iiff_user}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "[IIFF Backup] Starting backup of ${DB_NAME}..."

# Dump via Docker exec
docker exec iiff-postgres pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"

FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "[IIFF Backup] Backup saved: ${BACKUP_FILE} (${FILESIZE})"

# Keep only last 30 backups locally
cd "$BACKUP_DIR"
ls -t *.sql.gz 2>/dev/null | tail -n +31 | xargs -r rm --
cd - > /dev/null

echo "[IIFF Backup] Local cleanup done (keeping last 30 backups)"

# Optional: sync to Google Drive via rclone
if [ "$1" = "--rclone" ]; then
    RCLONE_REMOTE="${RCLONE_REMOTE:-gdrive:iiff-backups}"

    if ! command -v rclone &> /dev/null; then
        echo "[IIFF Backup] rclone not found. Skipping cloud sync."
        exit 0
    fi

    echo "[IIFF Backup] Syncing to ${RCLONE_REMOTE}..."
    rclone copy "$BACKUP_FILE" "$RCLONE_REMOTE/" --progress
    echo "[IIFF Backup] Cloud sync complete."
fi

echo "[IIFF Backup] Done."
```

- [ ] **Step 2: Make executable and add .gitkeep for backups dir**

```bash
chmod +x scripts/backup-db.sh
mkdir -p backups
touch backups/.gitkeep
```

- [ ] **Step 3: Update .gitignore for backups**

Add to root .gitignore:
```
backups/*.sql.gz
```

- [ ] **Step 4: Commit**

```bash
cd c:\WORK\IIFF && git add scripts/backup-db.sh backups/.gitkeep .gitignore && git commit -m "feat: add database backup script with optional rclone cloud sync"
```

---

## Task 6: Backend — Serve Static Uploads + Alembic Docker Config

**Files:**
- Modify: `backend/main.py` — serve uploaded files via `/uploads/`
- Modify: `backend/alembic.ini` — use env var for DB URL

- [ ] **Step 1: Add static file serving for uploads**

In `backend/main.py`, add after the health check:
```python
import os
from fastapi.staticfiles import StaticFiles

# Serve uploaded files
upload_path = settings.storage_base_path
if os.path.isdir(upload_path):
    app.mount("/uploads", StaticFiles(directory=upload_path), name="uploads")
```

- [ ] **Step 2: Update alembic env.py for Docker**

Read `backend/alembic/env.py` and ensure it uses `config.py`'s DATABASE_URL. The current `alembic.ini` has `sqlalchemy.url` but for Docker, `env.py` should override from the environment variable.

Check current env.py and update `run_migrations_online()` to use:
```python
from config import settings
connectable = engine_from_config(
    {"sqlalchemy.url": settings.database_url},
    prefix="sqlalchemy.",
    poolclass=pool.NullPool,
)
```

- [ ] **Step 3: Run all backend tests to confirm nothing broke**

```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/ -v
```

- [ ] **Step 4: Commit**

```bash
cd c:\WORK\IIFF && git add backend/main.py backend/alembic/ && git commit -m "feat(backend): serve uploaded files and fix Alembic config for Docker"
```

---

## Task 7: Integration Verification

- [ ] **Step 1: Run all backend tests**

```bash
cd c:\WORK\IIFF/backend && .venv/Scripts/python -m pytest tests/ -v
```

- [ ] **Step 2: Build frontend**

```bash
cd c:\WORK\IIFF/frontend && npm run build
```

- [ ] **Step 3: Verify Docker build (dry run)**

```bash
cd c:\WORK\IIFF && docker compose build --no-cache 2>&1 | tail -20
```

- [ ] **Step 4: Final commit if needed**

```bash
cd c:\WORK\IIFF && git add -A && git commit -m "feat: complete Phase 6 — Docker deployment with Nginx reverse proxy and backup"
```

---

## Summary

After Phase 6 completion:
- `docker compose up -d` starts full production stack (PostgreSQL + Backend + Frontend + Nginx)
- `docker compose -f docker-compose.dev.yml up -d` starts only PostgreSQL for local dev
- Nginx reverse proxy handles API (/api/), WebSocket (/ws/), uploads (/uploads/), and frontend (/)
- Backend auto-runs Alembic migrations on startup
- Uploaded files served via FastAPI StaticFiles
- Backup script: `./scripts/backup-db.sh` (local) or `./scripts/backup-db.sh --rclone` (+ Google Drive)
- Production env template with all required variables

**Project complete!** All 6 phases implemented:
1. Project setup + homepage
2. Authentication (local + Google OAuth)
3. Board system (6 boards with file upload)
4. Meeting system (Jitsi video + WebSocket chat)
5. Admin dashboard
6. Deployment + backup
