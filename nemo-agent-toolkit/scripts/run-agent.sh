#!/usr/bin/env bash
# Ms Money Penny Store — Agent Runner
# Usage: bash scripts/run-agent.sh <agent> <input>
# Examples:
#   bash scripts/run-agent.sh product "Find me wireless headphones"
#   bash scripts/run-agent.sh support "What is your return policy?"
#   bash scripts/run-agent.sh analytics "Show sales summary"
#   bash scripts/run-agent.sh hello "List five subspecies of Aardvarks"

set -euo pipefail

AGENT="${1:-hello}"
INPUT="${2:-Hello, what can you help me with?}"
CONFIG_DIR="$(dirname "$0")/../configs"

case "$AGENT" in
    product|search)
        CONFIG="$CONFIG_DIR/product-search.yml"
        echo "🛒 Running Product Search Agent..."
        ;;
    support|help)
        CONFIG="$CONFIG_DIR/customer-support.yml"
        echo "💬 Running Customer Support Agent..."
        ;;
    analytics|stats)
        CONFIG="$CONFIG_DIR/analytics.yml"
        echo "📊 Running Analytics Agent..."
        ;;
    hello|test)
        CONFIG="$CONFIG_DIR/hello-world.yml"
        echo "👋 Running Hello World Agent..."
        ;;
    *)
        echo "❌ Unknown agent: $AGENT"
        echo ""
        echo "Available agents:"
        echo "  product  - Product search and recommendations"
        echo "  support  - Customer support and FAQ"
        echo "  analytics - Sales and inventory insights"
        echo "  hello    - Hello world test agent"
        exit 1
        ;;
esac

echo "📝 Input: $INPUT"
echo "⚙️  Config: $CONFIG"
echo "---"
echo ""

nat run --config_file "$CONFIG" --input "$INPUT"