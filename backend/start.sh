#!/bin/bash
set -e

echo "[IIFF] Running Alembic migrations..."
python -m alembic upgrade head

echo "[IIFF] Seeding default data..."
python scripts/seed_boards.py
python scripts/seed_admin.py
python scripts/seed_posts.py

echo "[IIFF] Starting FastAPI server..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
