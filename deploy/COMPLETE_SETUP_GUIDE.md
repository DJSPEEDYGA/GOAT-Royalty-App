# 🐐 GOAT ROYALTY APP - COMPLETE SETUP GUIDE

## Generate Your SSH Deploy Key

⚠️ **Security note:** Never commit private keys to the repository. Run the script below once to generate your own deploy key pair, then add the public key to your servers and the private key to GitHub Secrets.

```bash
bash deploy/setup-ssh.sh
```

This creates:
- `~/.ssh/goat_deploy_key` (private key — for GitHub Secrets only)
- `~/.ssh/goat_deploy_key.pub` (public key — for Hostinger VPS)

---

## Step 1: Add SSH Key to Hostinger VPS

1. Go to: **https://hpanel.hostinger.com**
2. Navigate to: **VPS → Your Server → Settings → SSH Keys**
3. Click **"Add SSH Key"**
4. Paste the **PUBLIC KEY** above
5. **Repeat for both servers:**
   - srv1148455.hstgr.cloud (72.61.193.184)
   - srv832760.hstgr.cloud (93.127.214.171)

---

## Step 2: Add GitHub Secrets

Go to: **https://github.com/DJSPEEDYGA/GOAT-Royalty-App/settings/secrets/actions**

Click **"New repository secret"** and add these:

| Secret Name | Value |
|-------------|-------|
| `VPS1_HOST` | `72.61.193.184` |
| `VPS1_USER` | `root` |
| `VPS1_SSH_KEY` | *(Paste the PRIVATE KEY above)* |
| `VPS2_HOST` | `93.127.214.171` |
| `VPS2_USER` | `root` |
| `VPS2_SSH_KEY` | *(Paste the PRIVATE KEY above)* |

---

## Step 3: Test SSH Connection

After adding the keys to Hostinger, test the connection:

```bash
# Test VPS #1
ssh -i ~/.ssh/goat_deploy_key root@72.61.193.184

# Test VPS #2
ssh -i ~/.ssh/goat_deploy_key root@93.127.214.171
```

---

## Step 4: Deploy to Jetson

On your Jetson AGX Orin, run:

```bash
curl -fsSL https://raw.githubusercontent.com/DJSPEEDYGA/GOAT-Royalty-App/main/jetson-complete-deploy.sh | bash
```

---

## Step 5: Trigger Deployment

After setting up secrets, trigger deployment:

```bash
gh workflow run "deploy.yml" --repo DJSPEEDYGA/GOAT-Royalty-App -f target=all
```

Or push a commit to the `main` branch.

---

## Your Infrastructure Summary

| Server | IP Address | Role | Specs |
|--------|------------|------|-------|
| **VPS #1** | 72.61.193.184 | Production | KVM 2 (2 vCPU, 8GB RAM) |
| **VPS #2** | 93.127.214.171 | Database | KVM 8 (8 vCPU, 32GB RAM) |
| **Jetson** | Local Network | AI Engine | AGX Orin 64GB |
| **Local** | Your Desktop | Development | 2x RTX 3090 |

---

## What Gets Deployed

- ✅ **511 Songs** from Waka Flocka Flame catalog
- ✅ **142 Network Profiles**
- ✅ **Voice/Avatar System**
- ✅ **100% Local AI** (Ollama)
- ✅ **Auto-Update System**
- ✅ **No External APIs**

---

## Quick Commands

```bash
# View workflow status
gh run list --repo DJSPEEDYGA/GOAT-Royalty-App --limit 5

# View workflow logs
gh run view --repo DJSPEEDYGA/GOAT-Royalty-App

# Trigger manual deployment
gh workflow run "deploy.yml" --repo DJSPEEDYGA/GOAT-Royalty-App

# SSH to VPS #1
ssh -i ~/.ssh/goat_deploy_key root@72.61.193.184

# SSH to VPS #2
ssh -i ~/.ssh/goat_deploy_key root@93.127.214.171
```