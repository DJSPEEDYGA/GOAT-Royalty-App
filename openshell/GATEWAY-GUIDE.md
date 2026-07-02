# NVIDIA OpenShell — Deploy and Manage Gateways

> The gateway is the control plane for OpenShell. All control-plane traffic between the CLI and running sandboxes flows through the gateway.

---

## Gateway Responsibilities

- **Provisioning sandboxes** — creation, deletion, status monitoring
- **Storing provider credentials** — API keys, tokens delivered to sandboxes at startup
- **Delivering policies** — network and filesystem policies to sandboxes (proxy, OPA, Landlock, seccomp)
- **Managing inference configuration** — routing requests to correct backends
- **SSH tunnel endpoint** — connect to sandboxes without direct exposure
- **Single port** — gRPC + HTTP multiplexed, secured by mTLS by default

---

## Deploy a Local Gateway

Only prerequisite: a running Docker daemon.

```bash
openshell gateway start
```

Gateway becomes reachable at `https://127.0.0.1:8080`. Verify health:

```bash
openshell status
```

> **Tip:** You don't need to deploy a gateway manually. Running `openshell sandbox create` without a gateway auto-bootstraps a local one.

Custom port or name:

```bash
openshell gateway start --port 9090
openshell gateway start --name dev-local
```

---

## Deploy a Remote Gateway

Deploy on a remote machine via SSH (only dependency: Docker on remote host):

```bash
openshell gateway start --remote user@hostname
```

Gateway reachable at `https://<hostname>:8080`.

With SSH key:

```bash
openshell gateway start --remote user@hostname --ssh-key ~/.ssh/my_key
```

**For DGX Spark:**

```bash
openshell gateway start --remote <username>@<spark-ssid>.local
```

---

## Register an Existing Gateway

### Cloud Gateway (behind reverse proxy)

```bash
openshell gateway add https://gateway.example.com
openshell gateway add https://gateway.example.com --name production
```

Re-authenticate if token expires:

```bash
openshell gateway login
```

### Remote Gateway

```bash
openshell gateway add https://remote-host:8080 --remote user@remote-host
openshell gateway add ssh://user@remote-host:8080
```

### Local Gateway

```bash
openshell gateway add https://127.0.0.1:8080 --local
```

---

## Manage Multiple Gateways

One gateway is always **active** — all CLI commands target it by default.

```bash
# List all registered gateways
openshell gateway select

# Switch active gateway
openshell gateway select my-remote-cluster

# Override for a single command
openshell status -g my-other-cluster

# Show deployment details
openshell gateway info
openshell gateway info --name my-remote-cluster
```

---

## Advanced Start Options

| Flag | Purpose |
|------|---------|
| `--gpu` | Enable NVIDIA GPU passthrough (requires NVIDIA drivers + Container Toolkit) |
| `--plaintext` | Listen on HTTP instead of mTLS (use behind TLS-terminating proxy) |
| `--disable-gateway-auth` | Skip mTLS client certificate checks |
| `--registry-username` | Username for registry auth (defaults to `__token__` with `--registry-token`) |
| `--registry-token` | Auth token for pulling container images (GHCR: PAT with `read:packages`) |

Environment variables: `OPENSHELL_REGISTRY_USERNAME`, `OPENSHELL_REGISTRY_TOKEN`

---

## Stop and Destroy

```bash
# Stop (preserves state for restart)
openshell gateway stop
openshell gateway stop --name my-gateway

# Permanently destroy
openshell gateway destroy
openshell gateway destroy --name my-gateway
```

> For cloud gateways, `gateway destroy` removes only local registration — does not affect remote deployment.

---

## Troubleshoot

```bash
# Check health
openshell status

# View logs
openshell doctor logs
openshell doctor logs --tail              # stream live
openshell doctor logs --lines 50          # last 50 lines

# Exec into gateway container
openshell doctor exec -- kubectl get pods -A
openshell doctor exec -- sh

# Recreate if in bad state
openshell gateway start --recreate
```

---

## Integration with Ms Money Penny Store

The OpenShell gateway is integrated into the Ms Money Penny Store AI stack:

- **Tools Page**: Access OpenShell docs at `tools.html#openshell`
- **OpenClaw Gateway**: Running locally on port 18789 — `{"ok":true,"status":"live"}`
- **NemoClaw**: OpenClaw Plugin for OpenShell sandbox runtime
- **Desktop App**: Gateway management accessible from Electron app

---

*Reference: [NVIDIA OpenShell Developer Guide](https://developer.nvidia.com/openshell)*
*Integrated by DJSPEEDYGA — Life Imitates Art Inc.*