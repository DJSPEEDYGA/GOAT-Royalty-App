#!/bin/bash
# Launch the main Oscar chat server on port 3333.
set -euo pipefail

ROOT="/Volumes/Oscar/Master-Oscar"
SHARED="$ROOT/Shared"
DATA="$SHARED/chat_data"
LOG_DIR="$SHARED/logs"
PORT="3333"

mkdir -p "$DATA/tool_logs" "$LOG_DIR"

export AGENT_007_PORT="$PORT"
export OSCAR_CHAT_PORT="$PORT"
export AGENT_007_PROJECT_ROOT="$ROOT"
export AGENT_007_SHARED_DIR="$SHARED"
export AGENT_007_OWNER_APPROVAL_FILE="$DATA/owner_approval.json"
export AGENT_007_BRIDGE_WORKSPACE="$ROOT"
export AGENT_007_TOOL_WORKSPACE="$ROOT"
export AGENT_007_ALLOWED_ORIGINS="http://127.0.0.1:8765,http://localhost:8765,http://127.0.0.1:3333,http://localhost:3333,http://127.0.0.1:3334,http://localhost:3334,http://127.0.0.1:8787,http://localhost:8787"
export OLLAMA_PROXY_TARGET="http://127.0.0.1:11435"

cd "$ROOT"

if curl -s --max-time 2 http://127.0.0.1:$PORT/api/stats > /dev/null 2>&1; then
  echo "[OK] Oscar chat server is already running on http://127.0.0.1:$PORT"
  exit 0
fi

if [ -x "$SHARED/redeploy-oscar-chat.sh" ]; then
  "$SHARED/redeploy-oscar-chat.sh" --prepare-only "$PORT"
fi

echo "Starting Oscar chat server on http://127.0.0.1:$PORT..."
exec /usr/bin/python3 "$SHARED/chat_server.py" --no-browser
