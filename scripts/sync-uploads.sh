#!/bin/bash
# Sync local uploads to/from server
# Usage: ./scripts/sync-uploads.sh [push|pull]

SERVER="stevenlim@192.168.219.101"
REMOTE_PATH="/home/stevenlim/WORK/orbitron/deployments/iiff/uploads/"
LOCAL_PATH="D:/DATA/iiff-uploads/"

case "${1:-pull}" in
  push)
    echo "Pushing local uploads to server..."
    rsync -avz --progress -e ssh "$LOCAL_PATH" "$SERVER:$REMOTE_PATH"
    ;;
  pull)
    echo "Pulling server uploads to local..."
    rsync -avz --progress -e ssh "$SERVER:$REMOTE_PATH" "$LOCAL_PATH"
    ;;
  *)
    echo "Usage: $0 [push|pull]"
    exit 1
    ;;
esac

echo "Done!"
