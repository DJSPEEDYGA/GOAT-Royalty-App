#!/bin/bash
# ============================================================
# NVIDIA MODELS - 1-CLICK DOWNLOAD ALL
# Copy, paste, run. Downloads 15 NVIDIA NIM models via Docker.
# ============================================================
# Requires: Docker + NVIDIA GPU + NGC API Key
# Usage: bash NVIDIA-1-CLICK-DOWNLOAD.sh
# ============================================================

set -e

# ===== YOUR API KEY (from NGC / build.nvidia.com) =====
export NGC_API_KEY="${NGC_API_KEY:-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}"

echo "🚀 NVIDIA NIM Models - 1-Click Download"
echo "========================================"
echo ""

# ===== Check Docker =====
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not installed. Install with:"
    echo "   curl -fsSL https://get.docker.com | sh"
    exit 1
fi

# ===== Login to NGC =====
echo "🔑 Logging into NVIDIA NGC..."
echo "$NGC_API_KEY" | docker login nvcr.io -u '$oauthtoken' --password-stdin

# ===== Create storage =====
mkdir -p /models/nvidia-nim

# ===== All NVIDIA NIM Models =====
MODELS=(
    # Meta Llama
    "nvcr.io/nim/meta/llama-3.1-8b-instruct:latest"
    "nvcr.io/nim/meta/llama-3.1-70b-instruct:latest"
    "nvcr.io/nim/meta/llama-3.2-1b-instruct:latest"
    "nvcr.io/nim/meta/llama-3.2-3b-instruct:latest"
    # Google Gemma
    "nvcr.io/nim/google/gemma-2-9b-it:latest"
    "nvcr.io/nim/google/gemma-2-27b-it:latest"
    # Mistral
    "nvcr.io/nim/mistralai/mistral-7b-instruct:latest"
    "nvcr.io/nim/mistralai/mixtral-8x7b-instruct-v0.1:latest"
    "nvcr.io/nim/mistralai/mixtral-8x22b-instruct-v0.1:latest"
    # Microsoft Phi
    "nvcr.io/nim/microsoft/phi-3-mini-128k-instruct:latest"
    "nvcr.io/nim/microsoft/phi-3-medium-128k-instruct:latest"
    # NVIDIA Nemotron
    "nvcr.io/nim/nvidia/nemotron-4-340b-instruct:latest"
    "nvcr.io/nim/nvidia/nv-embedqa-e5-v5:latest"
    # Code Models
    "nvcr.io/nim/bigcode/starcoder2-15b:latest"
    "nvcr.io/nim/codellama/codellama-34b-instruct:latest"
)

TOTAL=${#MODELS[@]}
COUNT=0
SUCCESS=0
FAILED=0

echo ""
echo "📦 Downloading $TOTAL models..."
echo "========================================"

for model in "${MODELS[@]}"; do
    COUNT=$((COUNT+1))
    echo ""
    echo "[$COUNT/$TOTAL] 📥 $model"
    if docker pull "$model"; then
        SUCCESS=$((SUCCESS+1))
        echo "✅ DONE: $model"
    else
        FAILED=$((FAILED+1))
        echo "❌ FAILED: $model"
    fi
done

echo ""
echo "========================================"
echo "🎉 DOWNLOAD COMPLETE"
echo "   Total:   $TOTAL"
echo "   ✅ Success: $SUCCESS"
echo "   ❌ Failed:  $FAILED"
echo "========================================"
echo ""
echo "▶️  To run a model:"
echo "   docker run --gpus all -p 8000:8000 \\"
echo "     -e NGC_API_KEY=\$NGC_API_KEY \\"
echo "     nvcr.io/nim/meta/llama-3.1-8b-instruct:latest"
echo ""
echo "🔗 API will be at: http://localhost:8000/v1/chat/completions"