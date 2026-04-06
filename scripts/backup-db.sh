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
