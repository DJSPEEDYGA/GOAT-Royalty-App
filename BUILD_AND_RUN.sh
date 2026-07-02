#!/bin/bash
# ============================================================
# SUPER GOAT ROYALTIES - Build & Run Script
# Version: 5.1.0
# Author: DJSPEEDYGA
# ============================================================
# 
# This script builds the GOAT Royalties app for multiple platforms.
# Copy and paste this entire script into your terminal.
#
# USAGE:
#   chmod +x BUILD_AND_RUN.sh && ./BUILD_AND_RUN.sh
#
# REQUIREMENTS:
#   - Node.js 18+ and npm 9+
#   - For Windows builds on Linux: wine
#   - For macOS builds: macOS operating system
#
# ============================================================

set -e

echo "============================================================"
echo "SUPER GOAT ROYALTIES - Build Script v5.1.0"
echo "============================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Detect OS
OS="$(uname -s)"
case "$OS" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    CYGWIN*)    MACHINE=Cygwin;;
    MINGW*)     MACHINE=MinGw;;
    *)          MACHINE="UNKNOWN:$OS"
esac

echo -e "${GREEN}Detected OS: $MACHINE${NC}"

# Check Node.js version
NODE_VERSION=$(node -v 2>/dev/null || echo "not installed")
if [ "$NODE_VERSION" = "not installed" ]; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi
echo -e "${GREEN}Node.js version: $NODE_VERSION${NC}"

# Install dependencies
echo ""
echo "============================================================"
echo "Step 1: Installing dependencies..."
echo "============================================================"
npm install --legacy-peer-deps

# Build for current platform
echo ""
echo "============================================================"
echo "Step 2: Building application..."
echo "============================================================"

case "$MACHINE" in
    Linux)
        echo -e "${YELLOW}Building for Linux...${NC}"
        npm run electron:build:linux
        ;;
    Mac)
        echo -e "${YELLOW}Building for macOS...${NC}"
        npm run electron:build:mac
        ;;
    *)
        echo -e "${YELLOW}Building portable version...${NC}"
        npx electron-builder --win portable --x64
        ;;
esac

echo ""
echo "============================================================"
echo "Build Complete!"
echo "============================================================"
echo ""
echo "Output files are in the 'dist' folder:"
ls -la dist/
echo ""
echo -e "${GREEN}To run the app:${NC}"
case "$MACHINE" in
    Linux)
        echo "  ./dist/SUPER-GOAT-ROYALTIES-5.1.0-x86_64.AppImage"
        ;;
    Mac)
        echo "  Open dist/SUPER-GOAT-ROYALTIES-5.1.0.dmg"
        ;;
    *)
        echo "  Run dist/SUPER-GOAT-ROYALTIES-Portable-5.1.0.exe"
        ;;
esac
echo ""
echo "============================================================"