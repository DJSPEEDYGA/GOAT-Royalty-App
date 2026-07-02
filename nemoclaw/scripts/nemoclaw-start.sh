#!/usr/bin/env bash
# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# NemoClaw sandbox startup script.
# Launches OpenClaw agent inside the NemoClaw sandbox with NVIDIA inference.

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[nemoclaw]${NC} $1"; }
warn()  { echo -e "${YELLOW}[nemoclaw]${NC} $1"; }
error() { echo -e "${RED}[nemoclaw]${NC} $1"; exit 1; }

OPENCLAW_HOME="${HOME}/.openclaw"
NEMOCLAW_HOME="${HOME}/.nemoclaw"
AGENT_NAME="${NEMOCLAW_AGENT:-main}"
MODEL="${NEMOCLAW_MODEL:-nvidia/nemotron-3-super-120b-a12b}"

# ---------------------------------------------------------------------------
# Pre-flight checks
# ---------------------------------------------------------------------------
preflight() {
    info "Running pre-flight checks..."

    # Check OpenClaw is installed
    if ! command -v openclaw &>/dev/null; then
        error "OpenClaw CLI not found. Is the sandbox image built correctly?"
    fi

    # Check config exists
    if [[ ! -f "${OPENCLAW_HOME}/openclaw.json" ]]; then
        error "OpenClaw config not found at ${OPENCLAW_HOME}/openclaw.json"
    fi

    # Check NemoClaw plugin is installed
    if ! openclaw plugins list 2>/dev/null | grep -q nemoclaw; then
        warn "NemoClaw plugin not detected. Attempting to install..."
        openclaw plugins install /opt/nemoclaw 2>/dev/null || true
    fi

    # Check inference endpoint
    if curl -sf --max-time 5 https://inference.local/v1/health &>/dev/null; then
        info "Inference endpoint is reachable"
    else
        warn "Inference endpoint not yet reachable (may still be starting)"
    fi

    info "Pre-flight checks complete"
}

# ---------------------------------------------------------------------------
# Start agent
# ---------------------------------------------------------------------------
start_agent() {
    info "Starting OpenClaw agent '${AGENT_NAME}' with model: ${MODEL}"
    
    # Run OpenClaw doctor to verify setup
    openclaw doctor --fix 2>/dev/null || true

    # Launch the agent
    exec openclaw agent \
        --agent "${AGENT_NAME}" \
        --local \
        --model "${MODEL}" \
        "$@"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
main() {
    info "NemoClaw sandbox starting..."
    info "OpenClaw home: ${OPENCLAW_HOME}"
    info "Agent: ${AGENT_NAME}"
    info "Model: ${MODEL}"

    preflight
    start_agent "$@"
}

main "$@"