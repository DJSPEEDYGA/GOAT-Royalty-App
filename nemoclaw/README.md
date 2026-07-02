# NVIDIA NemoClaw — OpenClaw Plugin for OpenShell

<!-- start-badges -->
[![License](https://img.shields.io/badge/License-Apache_2.0-blue)](https://github.com/NVIDIA/NemoClaw/blob/main/LICENSE)
[![Security Policy](https://img.shields.io/badge/Security-Report%20a%20Vulnerability-red)](https://github.com/NVIDIA/NemoClaw/blob/main/SECURITY.md)
[![Project Status](https://img.shields.io/badge/status-alpha-orange)](https://github.com/NVIDIA/NemoClaw/blob/main/docs/about/release-notes.md)
<!-- end-badges -->

NVIDIA NemoClaw is an open source stack that simplifies running [OpenClaw](https://openclaw.ai) always-on assistants safely. It installs the [NVIDIA OpenShell](https://github.com/NVIDIA/OpenShell) runtime, part of [NVIDIA Agent Toolkit](https://docs.nvidia.com/nemo/agent-toolkit/latest), a secure environment for running autonomous agents, with inference routed through [NVIDIA cloud](https://build.nvidia.com).

> **Alpha software**
> 
> NemoClaw is early-stage. Expect rough edges. We are building toward production-ready sandbox orchestration, but the starting point is getting your own environment up and running.
> Interfaces, APIs, and behavior may change without notice as we iterate on the design.
> The project is shared to gather feedback and enable early experimentation, but it
> should not yet be considered production-ready.
> We welcome issues and discussion from the community while the project evolves.

---

## Quick Start

Follow these steps to get started with NemoClaw and your first sandboxed OpenClaw agent.

> **Note:** NemoClaw currently requires a fresh installation of OpenClaw.

### Prerequisites

Check the prerequisites before you start to ensure you have the necessary software and hardware to run NemoClaw.

#### Software

- Linux Ubuntu 22.04 LTS releases and later
- Node.js 20+ and npm 10+ (the installer recommends Node.js 22)
- Docker installed and running
- [NVIDIA OpenShell](https://github.com/NVIDIA/OpenShell) installed

### Install NemoClaw and Onboard OpenClaw Agent

Download and run the installer script. The script installs Node.js if it is not already present, then runs the guided onboard wizard to create a sandbox, configure inference, and apply security policies.

```console
$ curl -fsSL https://nvidia.com/nemoclaw.sh | bash
```

### Manual Installation

```bash
# Clone the repo
git clone https://github.com/NVIDIA/NemoClaw.git
cd NemoClaw

# Install globally
sudo npm install -g .

# Run the onboard wizard
nemoclaw onboard
```

---

## Architecture

```
Host Machine (Ubuntu 22.04+)
  └── Docker
       └── OpenShell gateway container
            └── k3s (embedded)
                 └── nemoclaw sandbox pod
                      └── OpenClaw agent + NemoClaw plugin
                           └── Inference via NVIDIA Cloud (build.nvidia.com)
```

### Components

| Component | Description |
|-----------|-------------|
| **NemoClaw CLI** | Node.js CLI tool (`nemoclaw`) for setup, onboarding, and management |
| **NemoClaw Plugin** | OpenClaw plugin that bridges the agent to NVIDIA inference |
| **NemoClaw Blueprint** | Python-based blueprint runner for sandbox orchestration |
| **OpenShell Runtime** | NVIDIA secure sandbox environment for autonomous agents |
| **OpenClaw** | AI agent gateway running inside the sandbox |
| **NVIDIA Inference** | Cloud-based model inference via build.nvidia.com |

### Default Model

NemoClaw configures OpenClaw to use **NVIDIA Nemotron 3 Super 120B** (`nvidia/nemotron-3-super-120b-a12b`) by default, routed through the OpenShell inference proxy at `https://inference.local/v1`.

---

## Docker Sandbox Image

NemoClaw builds a Docker image that packages OpenClaw + the NemoClaw plugin inside OpenShell:

```dockerfile
FROM node:22-slim

# Installs: Python 3, pip, curl, git, iproute2
# Creates sandbox user matching OpenShell convention
# Installs OpenClaw CLI globally (v2026.3.11)
# Copies NemoClaw plugin and blueprint
# Configures nvidia as default provider
# Routes inference through inference.local (OpenShell gateway proxy)
```

### Build the Image

```bash
docker build -t nemoclaw-sandbox .
```

### Run Standalone

```bash
docker run -it --rm nemoclaw-sandbox
```

---

## Configuration

### OpenClaw Agent Config

NemoClaw auto-generates `~/.openclaw/openclaw.json` inside the sandbox:

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "nvidia/nemotron-3-super-120b-a12b"
      }
    }
  },
  "models": {
    "mode": "merge",
    "providers": {
      "nvidia": {
        "baseUrl": "https://inference.local/v1",
        "apiKey": "openshell-managed",
        "api": "openai-completions",
        "models": [{
          "id": "nemotron-3-super-120b-a12b",
          "name": "NVIDIA Nemotron 3 Super 120B",
          "reasoning": false,
          "input": ["text"],
          "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
          "contextWindow": 131072,
          "maxTokens": 4096
        }]
      }
    }
  }
}
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NVIDIA_API_KEY` | NVIDIA API key from build.nvidia.com | *(prompted on first run)* |
| `NEMOCLAW_MODEL` | Default model for inference | `nemotron-3-super-120b-a12b` |
| `NEMOCLAW_SANDBOX_NAME` | Sandbox pod name | `nemoclaw` |

---

## Development

### Project Structure

```
NemoClaw/
├── bin/                    # CLI entry point
│   └── nemoclaw.js
├── nemoclaw/               # TypeScript plugin source
│   ├── dist/               # Compiled plugin
│   ├── openclaw.plugin.json
│   └── package.json
├── nemoclaw-blueprint/     # Python blueprint runner
├── scripts/                # Helper scripts
│   └── nemoclaw-start.sh   # Sandbox entry point
├── docs/                   # Sphinx documentation
├── Dockerfile              # Sandbox image definition
├── Makefile                # Build/lint/docs targets
├── package.json            # Root package config
├── pyproject.toml          # Python docs build config
├── install.sh              # Installer script
├── uninstall.sh            # Uninstaller script
├── CONTRIBUTING.md         # Contribution guidelines (DCO sign-off)
├── SECURITY.md             # NVIDIA security reporting
├── spark-install.md        # DGX Spark specific guide
└── LICENSE                 # Apache 2.0
```

### Build & Check

```bash
# Run all checks
make check

# Lint TypeScript
make lint-ts

# Lint Python
make lint-py

# Format all code
make format

# Build documentation
make docs

# Live docs preview
make docs-live
```

---

## NemoClaw on DGX Spark

DGX Spark ships Ubuntu 24.04 + Docker 28.x with cgroup v2, which requires special handling for k3s inside Docker. See the [Spark Install Guide](spark-install.md) for details.

### Quick Start on Spark

```bash
git clone https://github.com/NVIDIA/NemoClaw.git
cd NemoClaw
sudo npm install -g .
nemoclaw setup-spark
```

### Known Spark Issues

| Issue | Status | Workaround |
|-------|--------|------------|
| cgroup v2 kills k3s in Docker | Fixed in `setup-spark` | `daemon.json` cgroupns=host |
| Docker permission denied | Fixed in `setup-spark` | `usermod -aG docker` |
| CoreDNS CrashLoop after setup | Fixed in `fix-coredns.sh` | Uses container gateway IP |
| Image pull failure | OpenShell bug | Destroy and restart gateway |

---

## Uninstalling

```bash
./uninstall.sh
```

Options:
- `--yes` — Skip the confirmation prompt
- `--keep-openshell` — Leave the openshell binary installed
- `--delete-models` — Remove NemoClaw-pulled Ollama models

The uninstaller removes:
- NemoClaw helper services
- All OpenShell sandboxes plus gateway/providers
- Docker images built for the sandbox flow
- `~/.nemoclaw` and `~/.config/{openshell,nemoclaw}` state
- Global nemoclaw npm install/link
- OpenShell binary (unless `--keep-openshell`)

It preserves shared system tooling (Docker, Node.js, npm, Ollama) by default.

---

## Security

NVIDIA is dedicated to the security and trust of our software products. **Please do not report security vulnerabilities through GitHub.**

To report a potential security vulnerability:
- **Web:** [Security Vulnerability Submission Form](https://www.nvidia.com/object/submit-security-vulnerability.html)
- **Email:** psirt@nvidia.com (PGP key available)

Visit [NVIDIA PSIRT Policies](https://www.nvidia.com/en-us/security/psirt-policies/) for more information.

---

## Contributing

We require that all contributors sign-off on their commits using the Developer Certificate of Origin (DCO):

```bash
git commit -s -m "Add cool feature."
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

---

## Integration with Ms Money Penny Store

NemoClaw is integrated into the Ms Money Penny Desktop Store application as a secure sandbox runtime for AI agent workloads:

1. **Sandboxed AI Agents** — Run store AI assistants in secure OpenShell sandboxes
2. **NVIDIA Inference** — Route all model calls through NVIDIA cloud for enterprise-grade AI
3. **Plugin Architecture** — Extend OpenClaw with custom store functionality via NemoClaw plugin
4. **Blueprint Orchestration** — Define agent workflows using Python blueprints

### Related Integrations

- [NVIDIA NeMo Agent Toolkit](../nemo-agent-toolkit/README.md)
- [NVIDIA Nemotron Models](../nvidia-nemotron/README.md)
- [NVIDIA Speech Stack](../nvidia-speech/README.md)
- [NVIDIA OpenShell](../openshell/README.md)
- [Lightning AI Model APIs](../lightning-ai/README.md)
- [HuggingFace Models Catalog](../huggingface-models/README.md)

---

## License

Apache 2.0 — See [LICENSE](LICENSE) for full text.

**Copyright (c) 2025-2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.**

---

*Integrated by Life Imitates Art Inc. for the Ms Money Penny Desktop Store App.*