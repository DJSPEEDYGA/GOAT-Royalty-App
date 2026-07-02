#!/bin/bash

# ╔══════════════════════════════════════════════════════════════╗
# ║   🐐 GOAT ROYALTIES - ONE-COMMAND LAUNCHER                  ║
# ║   Stay Paid & Play Harder!                                  ║
# ╚══════════════════════════════════════════════════════════════╝

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   🐐 GOAT ROYALTIES - LAUNCHING                              ║"
echo "║   Created for OG & Boss                                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GOLD='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${GOLD}📦 Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${GOLD}📦 Installing dependencies...${NC}"
    npm install
fi

# Install express, cors, ws if not present
if [ ! -d "node_modules/express" ]; then
    echo -e "${GOLD}📦 Installing express, cors, ws...${NC}"
    npm install express cors ws --save
fi

echo ""
echo -e "${GREEN}✅ All dependencies ready!${NC}"
echo ""

# Create necessary directories
mkdir -p public static/css static/js static/images

# Start the server
echo -e "${GOLD}🚀 Starting GOAT Royalties Server...${NC}"
echo ""
node server.js &

# Wait for server to start
sleep 2

# Open browser (if available)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000 2>/dev/null
elif command -v open &> /dev/null; then
    open http://localhost:3000 2>/dev/null
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   🐐 GOAT ROYALTIES IS LIVE!                                 ║"
echo "║                                                              ║"
echo "║   📊 Dashboard: http://localhost:3000/ai-dashboard.html      ║"
echo "║   🤖 NEMO Chat: http://localhost:3000/nemo-chat.html         ║"
echo "║   🏦 Banking:   http://localhost:3000/banking.html           ║"
echo "║   💰 Wallet:    http://localhost:3000/wallet.html            ║"
echo "║   🎵 PRO:       http://localhost:3000/pro-royalties.html     ║"
echo "║                                                              ║"
echo "║   Press Ctrl+C to stop the server                           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Keep script running
wait