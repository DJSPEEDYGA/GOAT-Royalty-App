#!/bin/bash

# ============================================
# SUPER GOAT ROYALTIES - Multi-Platform Build Script
# Builds: Windows EXE, Windows Portable, macOS DMG, Linux AppImage
# All data embedded - one download, everything included
# ============================================

set -e

echo "🐐 SUPER GOAT ROYALTIES - Multi-Platform Build"
echo "=============================================="
echo ""

# Configuration
APP_NAME="SUPER-GOAT-ROYALTIES"
VERSION="5.1.0"
ELECTRON_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$ELECTRON_DIR/dist"
BUILD_DIR="$ELECTRON_DIR/build"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Create necessary directories
mkdir -p "$DIST_DIR"
mkdir -p "$BUILD_DIR"

echo -e "${CYAN}📦 Preparing build environment...${NC}"

# Check if node_modules exists
if [ ! -d "$ELECTRON_DIR/node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    cd "$ELECTRON_DIR" && npm install --legacy-peer-deps
fi

# Verify data files are present
echo -e "${CYAN}📊 Verifying embedded data files...${NC}"
DATA_FILES=(
    "$ELECTRON_DIR/data/waka_catalog.json"
    "$ELECTRON_DIR/data/network_profiles.json"
    "$ELECTRON_DIR/data/sync_opportunities.json"
    "$ELECTRON_DIR/data/goat-config.json"
)

for file in "${DATA_FILES[@]}"; do
    if [ -f "$file" ]; then
        SIZE=$(du -h "$file" | cut -f1)
        echo -e "  ${GREEN}✓${NC} $(basename $file) ($SIZE)"
    else
        echo -e "  ${RED}✗ Missing: $file${NC}"
    fi
done

# Create icon if not exists
if [ ! -f "$BUILD_DIR/icon.png" ]; then
    echo -e "${YELLOW}Creating default icon...${NC}"
    # Create a simple goat icon using ImageMagick if available
    if command -v convert &> /dev/null; then
        convert -size 512x512 xc:'#1a1a2e' \
            -gravity center \
            -pointsize 200 \
            -fill '#00e5cc' \
            -annotate 0 '🐐' \
            "$BUILD_DIR/icon.png" 2>/dev/null || true
    fi
    
    # Fallback: create empty icon placeholder
    if [ ! -f "$BUILD_DIR/icon.png" ]; then
        echo -e "${YELLOW}Note: Icon file not created. Using default Electron icon.${NC}"
    fi
fi

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}         BUILDING ALL PLATFORMS            ${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo ""

# Function to build for a specific platform
build_platform() {
    local platform=$1
    local arch=$2
    local target=$3
    
    echo -e "${CYAN}🔨 Building for $platform ($arch) - $target...${NC}"
    
    cd "$ELECTRON_DIR"
    
    case $platform in
        "win")
            if [ "$target" == "nsis" ]; then
                npx electron-builder --win --$arch --x64 --config.win.target=nsis
            elif [ "$target" == "portable" ]; then
                npx electron-builder --win --$arch --x64 --config.win.target=portable
            fi
            ;;
        "mac")
            npx electron-builder --mac --$arch --config.mac.target=dmg
            ;;
        "linux")
            npx electron-builder --linux --$arch --config.linux.target=AppImage
            ;;
    esac
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $platform build complete!${NC}"
    else
        echo -e "${RED}✗ $platform build failed${NC}"
    fi
    echo ""
}

# Check for build targets
BUILD_WIN=${BUILD_WIN:-true}
BUILD_MAC=${BUILD_MAC:-true}
BUILD_LINUX=${BUILD_LINUX:-true}

# Determine current platform
CURRENT_OS=$(uname -s)
case $CURRENT_OS in
    Linux*) 
        echo -e "${BLUE}Running on Linux - can build for Linux natively${NC}"
        echo -e "${YELLOW}Windows/macOS builds may require Wine or cross-compilation${NC}"
        ;;
    Darwin*) 
        echo -e "${BLUE}Running on macOS - can build for macOS natively${NC}"
        echo -e "${YELLOW}Windows builds require additional tools${NC}"
        ;;
    MINGW*|MSYS*|CYGWIN*) 
        echo -e "${BLUE}Running on Windows - can build for Windows natively${NC}"
        ;;
esac

echo ""

# Build Linux AppImage (works on Linux)
if [ "$BUILD_LINUX" = true ]; then
    echo -e "${YELLOW}🐧 Building Linux AppImage...${NC}"
    build_platform "linux" "x64" "AppImage"
fi

# Build Windows EXE (NSIS installer)
if [ "$BUILD_WIN" = true ]; then
    echo -e "${YELLOW}🪟 Building Windows EXE (Installer)...${NC}"
    build_platform "win" "x64" "nsis"
fi

# Build Windows Portable
if [ "$BUILD_WIN" = true ]; then
    echo -e "${YELLOW}🪟 Building Windows Portable...${NC}"
    build_platform "win" "x64" "portable"
fi

# Build macOS DMG
if [ "$BUILD_MAC" = true ]; then
    echo -e "${YELLOW}🍎 Building macOS DMG...${NC}"
    # Build for both Intel and Apple Silicon
    build_platform "mac" "x64" "dmg"
    build_platform "mac" "arm64" "dmg"
fi

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}         BUILD SUMMARY                     ${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo ""

# List built files
echo -e "${CYAN}📁 Built files in $DIST_DIR:${NC}"
echo ""

if [ -d "$DIST_DIR" ]; then
    find "$DIST_DIR" -type f \( -name "*.exe" -o -name "*.dmg" -o -name "*.AppImage" \) -exec ls -lh {} \; 2>/dev/null | while read line; do
        echo -e "  ${GREEN}✓${NC} $line"
    done
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}  🐐 SUPER GOAT ROYALTIES BUILD COMPLETE!  ${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}Downloads include:${NC}"
echo -e "  • 511 songs from WAKA FLOCKA FLAME ASCAP catalog"
echo -e "  • 142 network profiles with 140 connections"
echo -e "  • Royalty calculator for streaming & sync"
echo -e "  • Crypto mining dashboard"
echo -e "  • Video editor with 3D effects"
echo -e "  • DSP distribution manager"
echo -e "  • AI assistant (100% offline, no login required)"
echo ""
echo -e "${YELLOW}Platform builds:${NC}"
echo -e "  🪟 Windows: EXE installer + Portable version"
echo -e "  🍎 macOS: DMG for Intel & Apple Silicon"
echo -e "  🐧 Linux: AppImage (portable)"
echo ""