#!/bin/bash
# Launch Money Penny / GOAT Royalty App with i2i drive model pools
# This script sets up Agent-007 and Money Penny model folders on the i2i drive.

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
I2I_DRIVE="/Volumes/i2i 1"
AGENT007_MODELS="$I2I_DRIVE/Agent-007-Models"
MONEYPENNY_MODELS="$I2I_DRIVE/Money-Penny-Models"
SHARED_MODELS="$I2I_DRIVE/Agent-007-GOAT/Shared/models"
USB_MODELS="$I2I_DRIVE/Agent-007-GOAT/Portable-AI-USB-main/models"
UNCENSORED_MODELS="$I2I_DRIVE/Agent-007-GOAT/USB-Uncensored-LLM-main/models"
APP_MODELS="$APP_DIR/models"

# Ensure model folders exist
mkdir -p "$AGENT007_MODELS"
mkdir -p "$MONEYPENNY_MODELS"

# Build comma-separated model pool from existing directories
MODEL_PATHS=()
for dir in "$AGENT007_MODELS" "$MONEYPENNY_MODELS" "$SHARED_MODELS" "$USB_MODELS" "$UNCENSORED_MODELS" "$APP_MODELS"; do
    if [ -d "$dir" ]; then
        MODEL_PATHS+=("$dir")
    fi
done

# Join paths with commas
GOAT_MODEL_PATHS=$(IFS=,; echo "${MODEL_PATHS[*]}")

export GOAT_DATA_PATH="$I2I_DRIVE/GOAT-Royalty-Data"
export GOAT_MODEL_PATHS="$GOAT_MODEL_PATHS"

echo "🐐👑 Launching Money Penny / GOAT Royalty App"
echo "   App dir: $APP_DIR"
echo "   Data path: $GOAT_DATA_PATH"
echo "   Model paths: $GOAT_MODEL_PATHS"

cd "$APP_DIR" || exit 1
node server.js
