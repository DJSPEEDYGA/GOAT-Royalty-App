#!/bin/bash
# Launch the Oscar Ollama engine on port 11435 using the Oscar Drive model store.
set -euo pipefail

ROOT="/Volumes/Oscar/Master-Oscar"
SHARED="$ROOT/Shared"
RUNTIME="$SHARED/.ollama-runtime"
OLLAMA_BIN="$SHARED/bin/ollama-darwin"

mkdir -p "$RUNTIME/runners" "$RUNTIME/tmp" "$SHARED/logs"

export OLLAMA_MODELS="$SHARED/models/ollama_data"
export OLLAMA_HOME="$SHARED/models/ollama_data"
export OLLAMA_RUNNERS_DIR="$RUNTIME/runners"
export OLLAMA_TMPDIR="$RUNTIME/tmp"
export OLLAMA_HOST="127.0.0.1:11435"
export OLLAMA_NUM_PARALLEL=1
export OLLAMA_MAX_LOADED_MODELS=1
export OLLAMA_CONTEXT_LENGTH=32768
export OLLAMA_KEEP_ALIVE=30m
export OLLAMA_LOAD_TIMEOUT=10m
export OLLAMA_NO_CLOUD=true
export OLLAMA_ORIGINS="*"
export HOME="$RUNTIME"

cd "$ROOT"

if curl -s --max-time 2 http://127.0.0.1:11435/api/tags > /dev/null 2>&1; then
  echo "[OK] Oscar Ollama engine is already running on http://127.0.0.1:11435"
  exit 0
fi

echo "Starting Oscar Ollama engine on http://127.0.0.1:11435..."
exec "$OLLAMA_BIN" serve
