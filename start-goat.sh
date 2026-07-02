#!/usr/bin/env bash
# 🐐 GOAT Force — Full Stack Launcher
# Starts: Ollama AI Engine · Oscar Console (port 3333) · Web App (port 8090) · Intel Brain (port 5500)
cd "$(dirname "$0")"
GOLD="\033[1;33m"; GREEN="\033[1;32m"; CYAN="\033[1;36m"; RED="\033[0;31m"; NC="\033[0m"

echo -e "${GOLD}════════════════════════════════════════${NC}"
echo -e "${GOLD}  🐐 GOAT Force — Launching All Systems  ${NC}"
echo -e "${GOLD}════════════════════════════════════════${NC}"
echo ""

# ── 1. Ollama AI Engine ──────────────────────────────────
if command -v ollama &>/dev/null; then
  if ! pgrep -x ollama >/dev/null && ! pgrep -f "ollama serve" >/dev/null; then
    echo -e "${CYAN}🦙 Starting Ollama AI Engine...${NC}"
    nohup ollama serve >/tmp/ollama.log 2>&1 &
    sleep 3
    echo -e "${GREEN}✅ Ollama running${NC}"
  else
    echo -e "${GREEN}✅ Ollama already running${NC}"
  fi
else
  echo -e "${RED}⚠  Ollama not found — install from https://ollama.com/download${NC}"
fi

# ── 2. Kill stale servers ────────────────────────────────
pkill -f chat_server.py 2>/dev/null || true
pkill -f goat_intel.py 2>/dev/null || true
pkill -f "http.server 8090" 2>/dev/null || true
sleep 1

# ── 3. Oscar Console (port 3333) ────────────────────────
OSCAR_DIR="$(pwd)/web-app/usb-ai/Shared"
if [ -f "$OSCAR_DIR/chat_server.py" ]; then
  echo -e "${CYAN}🐐 Starting Oscar Console on http://127.0.0.1:3333/ ...${NC}"
  cd "$OSCAR_DIR"
  nohup python3 chat_server.py >/tmp/oscar.log 2>&1 &
  cd - >/dev/null
  sleep 2
  echo -e "${GREEN}✅ Oscar Console live at http://127.0.0.1:3333/${NC}"
else
  echo -e "${RED}⚠  Oscar chat_server.py not found at $OSCAR_DIR${NC}"
fi

# ── 4. Intel Brain (port 5500) ───────────────────────────
if [ -f "goat-intel-server/goat_intel.py" ]; then
  echo -e "${CYAN}🧠 Starting Intel Brain on http://localhost:5500 ...${NC}"
  cd goat-intel-server
  nohup python3 goat_intel.py >/tmp/goat-intel.log 2>&1 &
  cd ..
fi

# ── 5. Web App (port 8090) ───────────────────────────────
echo -e "${CYAN}🌐 Starting Web App on http://localhost:8090 ...${NC}"
cd web-app
nohup python3 -m http.server 8090 >/tmp/goat-web.log 2>&1 &
cd ..

sleep 2

# ── Summary ──────────────────────────────────────────────
echo ""
echo -e "${GOLD}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ ALL SYSTEMS GO — GOAT Force is live!${NC}"
echo -e "${GOLD}════════════════════════════════════════${NC}"
echo ""
echo -e "   🐐 Oscar Console:    ${CYAN}http://127.0.0.1:3333/${NC}          ← START HERE"
echo -e "   🎛️  Touch Studio:     ${CYAN}http://127.0.0.1:3333/${NC} → 🎛️ button"
echo -e "   🚀 Launcher Hub:     ${CYAN}http://localhost:8090/goat-launcher-hub.html${NC}"
echo -e "   ⚡ Powerhouse:       ${CYAN}http://localhost:8090/powerhouse.html${NC}"
echo -e "   🤖 AI Brain:         ${CYAN}http://localhost:8090/agents-brain.html${NC}"
echo -e "   💼 Living EPK:       ${CYAN}http://72.61.193.184/epk/${NC}  (public link for investors)"
echo ""
echo -e "${GOLD}Press Ctrl+C to stop all services${NC}"

# Open Oscar Console first (primary app)
if [[ "$OSTYPE" == "darwin"* ]]; then
  open "http://127.0.0.1:3333/"
  sleep 1
  open "http://localhost:8090/goat-launcher-hub.html"
elif command -v xdg-open &>/dev/null; then
  xdg-open "http://127.0.0.1:3333/" &>/dev/null
fi

# Keep running — Ctrl+C stops everything
trap 'echo -e "\n${GOLD}⏹ Stopping GOAT Force...${NC}"; pkill -f chat_server.py; pkill -f goat_intel.py; pkill -f "http.server 8090"; echo -e "${GREEN}Done. Goodbye.${NC}"; exit 0' INT
wait
