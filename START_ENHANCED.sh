#!/bin/bash

# SUPER GOAT ROYALTIES - Enhanced Startup Script
# This script starts the GOAT app with all enhancements enabled

echo "🐐 =========================================="
echo "    SUPER GOAT ROYALTIES - STARTING UP"
echo "=========================================="

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from example..."
    cp .env.example .env
    echo "✅ Created .env file. Please configure your API keys."
fi

# Load environment variables
source .env 2>/dev/null || export $(cat .env | grep -v '^#' | xargs)

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Install new dependencies for enhancements
echo "📦 Checking for new dependencies..."
npm install sqlite3 bcrypt jsonwebtoken --save 2>/dev/null || true

# Create data directory for database
mkdir -p data

# Check for NVIDIA API key
if [ -n "$NVIDIA_API_KEY" ]; then
    echo "✅ NVIDIA API key configured"
    echo "   Running in NVIDIA NIM MODE"
else
    echo "⚠️  No NVIDIA API key - Running in LOCAL MODE"
    echo "   Set NVIDIA_API_KEY in .env for cloud AI features"
fi

# Check for mining wallet configuration
if grep -q "address: ''" lib/mining/wallet-config.js 2>/dev/null; then
    echo "⚠️  Mining wallets not configured"
    echo "   Edit lib/mining/wallet-config.js to add your wallet addresses"
fi

# Display configuration
echo ""
echo "📋 Configuration Summary:"
echo "   - Port: ${PORT:-3000}"
echo "   - Environment: ${NODE_ENV:-development}"
echo "   - Local Mode: ${LOCAL_MODE:-true}"
echo "   - Demo Mode: ${DEMO_MODE:-false}"
echo ""

# Start the server
echo "🚀 Starting GOAT Royalties Server..."
echo ""

node server.js &

# Wait for server to start
sleep 2

# Check if server is running
if curl -s http://localhost:${PORT:-3000}/api/status > /dev/null 2>&1; then
    echo ""
    echo "✅ Server is running!"
    echo ""
    echo "🌐 Access the app at: http://localhost:${PORT:-3000}"
    echo "📊 Health check: http://localhost:${PORT:-3000}/api/health"
    echo "📡 WebSocket: ws://localhost:${PORT:-3000}"
    echo ""
    echo "🐐 GOAT ROYALTIES IS READY!"
    echo ""
else
    echo "⚠️  Server may still be starting. Check logs above."
fi

# Keep script running to show logs
wait