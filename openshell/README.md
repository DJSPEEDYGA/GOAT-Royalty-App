# NVIDIA OpenShell

> **OpenShell** — The safe, private runtime for autonomous AI agents by NVIDIA.

## Overview

OpenShell provides a secure, sandboxed execution environment for AI agents. It enables agents to safely execute code, run commands, and interact with systems without risking the host environment.

| Property | Value |
|----------|-------|
| **Package** | `openshell` |
| **Version** | 0.0.10 |
| **Author** | NVIDIA Inc. |
| **License** | Apache-2.0 |
| **Python** | ≥ 3.12 |
| **PyPI** | [openshell](https://pypi.org/project/openshell/) |

---

## Installation

```bash
# Install from PyPI
pip install openshell
```

### Platform Support

| Platform | Architecture | Status |
|----------|-------------|--------|
| **Linux** | x86_64 (glibc 2.39+) | ✅ Supported |
| **Linux** | ARM64/aarch64 (glibc 2.39+) | ✅ Supported |
| **macOS** | ARM64 (macOS 11.0+) | ✅ Supported |
| **Windows** | — | 🔜 Coming soon |

### System Requirements
- Python 3.12 or 3.13
- Linux (glibc 2.39+) or macOS 11.0+ (ARM64)
- For GPU-accelerated workloads: NVIDIA GPU with CUDA 12.0+

---

## Key Features

- **🔒 Secure Sandbox** — Isolated execution environment for AI agent code
- **🔐 Private Runtime** — Code and data stay local, never leave the sandbox
- **🤖 Agent Native** — Purpose-built for autonomous AI agent workloads
- **⚡ High Performance** — Rust-powered core for minimal overhead
- **🐍 Python API** — Simple Python interface for integration
- **🔗 Framework Compatible** — Works with LangChain, LlamaIndex, CrewAI, NeMo Agent Toolkit, and more

---

## Quick Start

```python
import openshell

# Create a new sandbox session
session = openshell.Session()

# Execute code safely in the sandbox
result = session.run("python3 -c 'print(2 + 2)'")
print(result.stdout)  # Output: 4

# Execute multi-line scripts
code = """
import json
data = {"store": "Ms Money Penny", "products": 6}
print(json.dumps(data, indent=2))
"""
result = session.run_script(code, language="python")
print(result.stdout)

# File operations in the sandbox
session.write_file("/workspace/hello.txt", "Hello from OpenShell!")
content = session.read_file("/workspace/hello.txt")
print(content)  # Output: Hello from OpenShell!

# Clean up
session.close()
```

---

## Integration with NeMo Agent Toolkit

OpenShell can be used as the execution runtime for NeMo Agent Toolkit workflows:

```yaml
# workflow.yml — NAT workflow with OpenShell runtime
functions:
  code_executor:
    _type: openshell
    description: "Execute Python code safely in a sandbox"
    timeout: 30
    allowed_packages:
      - numpy
      - pandas
      - requests

  wikipedia_search:
    _type: wiki_search
    max_results: 3

llms:
  nemotron_nano:
    _type: nim
    model_name: nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16
    temperature: 0.0

workflow:
  _type: react_agent
  tool_names: [code_executor, wikipedia_search]
  llm_name: nemotron_nano
  verbose: true
  system_prompt: |
    You are an AI assistant with the ability to execute Python code safely.
    Use the code_executor tool to run calculations, process data, or test ideas.
    Always verify your results by running code rather than guessing.
```

---

## Integration with LangChain

```python
from langchain.agents import initialize_agent, AgentType
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from openshell.integrations.langchain import OpenShellTool

# Create the OpenShell tool
shell_tool = OpenShellTool(
    name="code_sandbox",
    description="Execute Python code safely in an isolated sandbox",
)

# Create the agent
llm = ChatNVIDIA(model="nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16")
agent = initialize_agent(
    tools=[shell_tool],
    llm=llm,
    agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
)

# Run
result = agent.run("Calculate the first 20 Fibonacci numbers")
print(result)
```

---

## Security Model

OpenShell provides multiple layers of security:

1. **Process Isolation** — Each session runs in its own isolated process
2. **Filesystem Sandboxing** — Agents can only access designated directories
3. **Network Controls** — Configurable network access policies
4. **Resource Limits** — CPU, memory, and time limits per execution
5. **Package Allowlists** — Control which Python packages agents can import
6. **Audit Logging** — Full execution history for compliance and debugging

---

## Configuration

```python
import openshell

config = openshell.Config(
    # Sandbox settings
    sandbox_dir="/workspace/agent-sandbox",
    max_execution_time=60,       # seconds
    max_memory_mb=2048,          # MB
    
    # Network policy
    network_enabled=True,
    allowed_hosts=["api.nvidia.com", "pypi.org"],
    
    # Package management
    allowed_packages=["numpy", "pandas", "requests", "beautifulsoup4"],
    auto_install=True,
    
    # Logging
    log_level="info",
    audit_log="/var/log/openshell/audit.log",
)

session = openshell.Session(config=config)
```

---

## Links

- [PyPI Package](https://pypi.org/project/openshell/)
- [NVIDIA NeMo Agent Toolkit](https://docs.nvidia.com/nemo/agent-toolkit/)
- [NVIDIA Build](https://build.nvidia.com)
- [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0)

---

## Tags

`agent` · `sandbox` · `nvidia` · `runtime` · `security` · `AI`