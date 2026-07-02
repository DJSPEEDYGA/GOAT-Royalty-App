#!/usr/bin/env bash
# ============================================================================
# Lightning AI Model APIs — Setup Script
# ============================================================================
# Installs dependencies and configures the Lightning AI integration
# for the Ms Money Penny Desktop Store App.
#
# Usage:
#   chmod +x setup.sh && ./setup.sh
# ============================================================================

set -euo pipefail

BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
CYAN="\033[0;36m"
RESET="\033[0m"

echo -e "${BOLD}${CYAN}"
echo "  ⚡ Lightning AI — Model APIs Setup"
echo "  Ms Money Penny Desktop Store Integration"
echo -e "${RESET}"

# ── Check Python ─────────────────────────────────────────────────────────────
echo -e "${BOLD}[1/5] Checking Python...${RESET}"
if command -v python3 &>/dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1)
    echo -e "  ${GREEN}✓${RESET} $PYTHON_VERSION"
else
    echo -e "  ${YELLOW}⚠ Python 3 not found. Please install Python 3.9+${RESET}"
    exit 1
fi

# ── Install Dependencies ─────────────────────────────────────────────────────
echo -e "\n${BOLD}[2/5] Installing Python dependencies...${RESET}"
pip install --quiet --upgrade \
    openai \
    requests \
    pyyaml \
    python-dotenv \
    aiohttp \
    tenacity

echo -e "  ${GREEN}✓${RESET} Dependencies installed"

# ── Check for Lightning AI SDK ────────────────────────────────────────────────
echo -e "\n${BOLD}[3/5] Installing Lightning AI SDK (optional)...${RESET}"
if pip install --quiet lightning-sdk litserve 2>/dev/null; then
    echo -e "  ${GREEN}✓${RESET} Lightning SDK installed"
else
    echo -e "  ${YELLOW}⚠${RESET} Lightning SDK install failed (optional — API access still works via OpenAI SDK)"
fi

# ── Configure API Key ────────────────────────────────────────────────────────
echo -e "\n${BOLD}[4/5] Configuring API key...${RESET}"

ENV_FILE="$(dirname "$0")/../.env"

if [ -f "$ENV_FILE" ]; then
    echo -e "  ${GREEN}✓${RESET} .env file already exists at $ENV_FILE"
else
    echo -e "  Creating .env file..."
    cat > "$ENV_FILE" << 'EOF'
# Lightning AI Model APIs Configuration
# Get your API key at: https://lightning.ai
LIGHTNING_API_KEY=your-api-key-here
LIGHTNING_API_BASE=https://api.lightning.ai/v1

# Default model for the store assistant
LIGHTNING_DEFAULT_MODEL=gpt-oss-120b
LIGHTNING_FALLBACK_MODEL=gpt-oss-20b

# Cost controls
LIGHTNING_DAILY_BUDGET=50.00
LIGHTNING_PER_REQUEST_LIMIT=1.00

# Caching
LIGHTNING_CACHE_ENABLED=true
LIGHTNING_CACHE_TTL=3600
EOF
    echo -e "  ${GREEN}✓${RESET} .env file created at $ENV_FILE"
    echo -e "  ${YELLOW}⚠ Please update LIGHTNING_API_KEY with your actual key${RESET}"
fi

# ── Verify Setup ─────────────────────────────────────────────────────────────
echo -e "\n${BOLD}[5/5] Verifying setup...${RESET}"

python3 -c "
import openai
import requests
import yaml
print('  ✓ All required packages available')
" 2>/dev/null || echo -e "  ${YELLOW}⚠ Some packages may need manual installation${RESET}"

# ── Summary ──────────────────────────────────────────────────────────────────
echo -e "\n${BOLD}${GREEN}═══════════════════════════════════════════════════════${RESET}"
echo -e "${BOLD}${GREEN}  ⚡ Lightning AI Setup Complete!${RESET}"
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════════${RESET}"
echo ""
echo -e "  Next steps:"
echo -e "  1. Get your API key at ${CYAN}https://lightning.ai${RESET}"
echo -e "  2. Update ${CYAN}$ENV_FILE${RESET} with your key"
echo -e "  3. Run the model selector:"
echo -e "     ${CYAN}python3 scripts/model-selector.py --list-models${RESET}"
echo -e "  4. Test a model:"
echo -e "     ${CYAN}python3 scripts/test-models.py${RESET}"
echo ""