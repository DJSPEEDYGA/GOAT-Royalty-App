#!/bin/bash
# Master launcher: start Ollama, Oscar (3333), Agent 007 (3334), and open crew agents.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="/Volumes/Oscar/Master-Oscar"

echo "==================================================="
echo "   Launching Oscar + Agent 007 + Crew Agents"
echo "==================================================="
echo ""

start_if_needed() {
  local script="$1"
  local name="$2"
  local log="$3"
  if pgrep -f "$script" > /dev/null 2>&1; then
    echo "[OK] $name is already running."
  else
    echo "[START] $name..."
    nohup bash "$script" >> "$log" 2>&1 &
    disown
  fi
}

mkdir -p "$ROOT/Shared/logs"

start_if_needed "launch-ollama-11435.sh" "Oscar Ollama engine (11435)" "$ROOT/Shared/logs/launch-ollama-11435-manual.log"
start_if_needed "launch-oscar-3333.sh" "Oscar chat server (3333)" "$ROOT/Shared/logs/launch-oscar-3333-manual.log"
start_if_needed "launch-agent-007-3334.sh" "Agent 007 chat server (3334)" "$ROOT/Shared/logs/launch-agent-007-3334-manual.log"

echo ""
echo "Waiting for services to come online..."
for _ in $(seq 1 60); do
  if curl -s --max-time 1 http://127.0.0.1:11435/api/tags > /dev/null 2>&1 && \
     curl -s --max-time 1 http://127.0.0.1:3333/api/stats > /dev/null 2>&1 && \
     curl -s --max-time 1 http://127.0.0.1:3334/api/stats > /dev/null 2>&1; then
    echo ""
    echo "[OK] All services are online."
    break
  fi
  sleep 1
done

echo ""
echo "Opening crew agent launchers..."
bash "$SCRIPT_DIR/launch-crew-agents.command"

echo ""
echo "==================================================="
echo "   Oscar Agent Suite is running"
echo "==================================================="
echo "  Ollama engine:  http://127.0.0.1:11435"
echo "  Oscar:          http://localhost:3333"
echo "  Agent 007:      http://localhost:3334"
echo ""
echo "  Close this Terminal window to keep services running in background,"
echo "  or press Ctrl+C to stop the foreground script."
echo "==================================================="

# Keep the script alive so the terminal window stays open
while true; do
  sleep 5
  if ! curl -s --max-time 1 http://127.0.0.1:11435/api/tags > /dev/null 2>&1; then
    echo "[WARN] Ollama engine is not responding."
  fi
  if ! curl -s --max-time 1 http://127.0.0.1:3333/api/stats > /dev/null 2>&1; then
    echo "[WARN] Oscar chat server is not responding."
  fi
  if ! curl -s --max-time 1 http://127.0.0.1:3334/api/stats > /dev/null 2>&1; then
    echo "[WARN] Agent 007 chat server is not responding."
  fi
done
