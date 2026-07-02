#!/usr/bin/env bash
# Ms Money Penny Store — NeMo Agent Toolkit Setup Script
# Usage: bash scripts/setup.sh

set -euo pipefail

echo "============================================"
echo "  Ms Money Penny Store"
echo "  NeMo Agent Toolkit Setup"
echo "============================================"
echo ""

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "✅ Python: $PYTHON_VERSION"

# Check for NVIDIA API key
if [ -z "${NVIDIA_API_KEY:-}" ]; then
    echo ""
    echo "⚠️  NVIDIA_API_KEY not set!"
    echo "   Get your key at: https://build.nvidia.com"
    echo "   Then run: export NVIDIA_API_KEY=<your_key>"
    echo ""
else
    echo "✅ NVIDIA_API_KEY is set"
fi

# Install NeMo Agent Toolkit
echo ""
echo "📦 Installing NeMo Agent Toolkit..."
if command -v uv &> /dev/null; then
    echo "   Using uv..."
    uv pip install "nvidia-nat[langchain]"
else
    echo "   Using pip..."
    pip install "nvidia-nat[langchain]"
fi

# Verify installation
echo ""
echo "🔍 Verifying installation..."
python3 -c "import nat; print(f'   NeMo Agent Toolkit version: {nat.__version__}')" 2>/dev/null || echo "   ⚠️ Could not verify NAT version"

# Check nat CLI
if command -v nat &> /dev/null; then
    echo "✅ nat CLI available"
else
    echo "⚠️  nat CLI not found in PATH. Try: python3 -m nat"
fi

echo ""
echo "============================================"
echo "  Setup Complete!"
echo "============================================"
echo ""
echo "Quick start commands:"
echo "  nat run --config_file configs/hello-world.yml --input 'Hello!'"
echo "  nat run --config_file configs/product-search.yml --input 'Find headphones'"
echo "  nat run --config_file configs/customer-support.yml --input 'Return policy?'"
echo ""