# NVIDIA NeMo Agent Toolkit Integration

> **NeMo Agent Toolkit (NAT) 1.5** — Flexible, lightweight library for connecting enterprise agents to data sources and tools across any framework.

## Quick Start

```bash
# Install
uv pip install "nvidia-nat[langchain]"

# Set API key (get one at https://build.nvidia.com)
export NVIDIA_API_KEY=<your_key>

# Run an agent
nat run --config_file configs/hello-world.yml --input "List five subspecies of Aardvarks"
```

## Available Agents

| Agent | Config | Description |
|-------|--------|-------------|
| **Product Search** | `configs/product-search.yml` | Natural language product search and recommendations |
| **Customer Support** | `configs/customer-support.yml` | Automated support with FAQ and order lookup |
| **Analytics** | `configs/analytics.yml` | Sales and inventory insights |
| **Hello World** | `configs/hello-world.yml` | Basic example with Wikipedia search |

## Key Features

- **Framework Agnostic** — Works with LangChain, LlamaIndex, CrewAI, Semantic Kernel, Google ADK
- **Full MCP Support** — Model Context Protocol client and server
- **A2A Protocol** — Agent-to-Agent communication
- **Profiling & Observability** — Phoenix, Weave, Langfuse, OpenTelemetry
- **Evaluation System** — Built-in accuracy validation

## Scripts

```bash
bash scripts/setup.sh                              # Install dependencies
bash scripts/run-agent.sh product "Find headphones" # Run product agent
bash scripts/run-agent.sh support "Return policy?"  # Run support agent
```

## Docker

```bash
docker-compose up -d  # Start NAT API, MCP, and A2A servers
```

## Links

- [NeMo Agent Toolkit Docs](https://docs.nvidia.com/nemo/agent-toolkit/)
- [GitHub](https://github.com/NVIDIA/NeMo-Agent-Toolkit)
- [NVIDIA Build](https://build.nvidia.com)