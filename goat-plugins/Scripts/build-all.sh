#!/bin/bash
# ================================================================
# GOAT Plugin Suite — Build / Validate / Install All Plugins
# Run this on your Mac (macOS) with AAX SDK + JUCE installed.
# ================================================================
set -e

# ---- Config ----
: "${AAX_SDK_PATH:=$HOME/Audio/AAX_SDK_2.9.0}"
: "${JUCE_PATH:=$HOME/JUCE}"
: "${BUILD_TYPE:=Release}"

DIGISHELL="/Applications/Avid/DigiShell/AAXValidator"
PLUGIN_DEST="/Library/Application Support/Avid/Audio/Plug-Ins"
AU_DEST="$HOME/Library/Audio/Plug-Ins/Components"
VST3_DEST="$HOME/Library/Audio/Plug-Ins/VST3"

PLUGINS=("GoatSaturator" "BrickSquad808" "WakaVocalChain" "GoatBus")

# ---- Colors ----
G='\033[0;32m'; Y='\033[1;33m'; R='\033[0;31m'; B='\033[1;34m'; N='\033[0m'

echo -e "${B}╔════════════════════════════════════════════════════════════╗${N}"
echo -e "${B}║  🐐 GOAT PLUGIN SUITE — BUILD / VALIDATE / INSTALL        ║${N}"
echo -e "${B}║  DJ Speedy / GOAT Force / BrickSquad                       ║${N}"
echo -e "${B}╚════════════════════════════════════════════════════════════╝${N}"

# ---- Pre-flight checks ----
echo -e "\n${Y}▸ Pre-flight checks...${N}"
if [ ! -d "$AAX_SDK_PATH" ]; then
    echo -e "${R}✖ AAX_SDK_PATH not found: $AAX_SDK_PATH${N}"
    echo "  Download from your Avid Developer account (AAX SDK 2.9.0) and unzip to ~/Audio/"
    exit 1
fi
if [ ! -d "$JUCE_PATH" ]; then
    echo -e "${R}✖ JUCE_PATH not found: $JUCE_PATH${N}"
    echo "  git clone https://github.com/juce-framework/JUCE.git ~/JUCE"
    exit 1
fi
if ! command -v cmake &> /dev/null; then
    echo -e "${R}✖ cmake not found. Install: brew install cmake${N}"
    exit 1
fi

echo -e "${G}  ✓ AAX SDK:  $AAX_SDK_PATH${N}"
echo -e "${G}  ✓ JUCE:     $JUCE_PATH${N}"
echo -e "${G}  ✓ CMake:    $(cmake --version | head -1)${N}"

cd "$(dirname "$0")/.."
ROOT=$(pwd)

# ---- Build each plugin ----
for P in "${PLUGINS[@]}"; do
    echo -e "\n${B}━━━ Building ${P} ━━━${N}"
    cd "$ROOT/$P"
    rm -rf build
    cmake -B build \
        -DCMAKE_BUILD_TYPE=$BUILD_TYPE \
        -DAAX_SDK_PATH="$AAX_SDK_PATH" \
        -DJUCE_PATH="$JUCE_PATH" \
        -G "Unix Makefiles"
    cmake --build build --config $BUILD_TYPE -j$(sysctl -n hw.ncpu)
    echo -e "${G}  ✓ ${P} built successfully${N}"
done

# ---- Validate AAX builds with DigiShell ----
if [ -f "$DIGISHELL" ]; then
    echo -e "\n${Y}▸ Validating AAX plugins with DigiShell...${N}"
    for P in "${PLUGINS[@]}"; do
        AAX_BUNDLE=$(find "$ROOT/$P/build" -name "*.aaxplugin" -type d | head -1)
        if [ -n "$AAX_BUNDLE" ]; then
            echo -e "  Validating: $AAX_BUNDLE"
            "$DIGISHELL" --plugin "$AAX_BUNDLE" || echo -e "${Y}  ⚠ validation warnings for ${P}${N}"
        fi
    done
else
    echo -e "${Y}⚠ DigiShell not found at $DIGISHELL — skipping validation${N}"
    echo "  Install from Avid Developer account: AAX Developer Tools 24.6"
fi

# ---- Install summary ----
echo -e "\n${G}╔════════════════════════════════════════════════════════════╗${N}"
echo -e "${G}║  ✓ BUILD COMPLETE                                          ║${N}"
echo -e "${G}╠════════════════════════════════════════════════════════════╣${N}"
for P in "${PLUGINS[@]}"; do
    AAX=$(find "$ROOT/$P/build" -name "*.aaxplugin" -type d | head -1)
    AU=$(find  "$ROOT/$P/build" -name "*.component" -type d | head -1)
    VST3=$(find "$ROOT/$P/build" -name "*.vst3" -type d | head -1)
    echo -e "${G}║  ${P}${N}"
    [ -n "$AAX" ]  && echo -e "    AAX:  $AAX"
    [ -n "$AU" ]   && echo -e "    AU:   $AU"
    [ -n "$VST3" ] && echo -e "    VST3: $VST3"
done
echo -e "${G}╚════════════════════════════════════════════════════════════╝${N}"

echo -e "\n${Y}▸ CMake was configured with COPY_PLUGIN_AFTER_BUILD=TRUE${N}"
echo -e "${Y}  Plugins were auto-copied to system locations. Restart:${N}"
echo -e "  • Pro Tools   → AAX loaded from /Library/Application Support/Avid/Audio/Plug-Ins/"
echo -e "  • Logic Pro   → AU loaded from ~/Library/Audio/Plug-Ins/Components/"
echo -e "  • Ableton/etc → VST3 loaded from ~/Library/Audio/Plug-Ins/VST3/"
echo -e "\n${G}🐐 GOAT FORCE PLUGINS READY. FIRE UP YOUR DAW.${N}"