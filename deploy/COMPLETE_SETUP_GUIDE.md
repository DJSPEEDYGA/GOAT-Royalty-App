# 🐐 GOAT ROYALTY APP - COMPLETE SETUP GUIDE

## Your SSH Keys (Generated)

### Public Key (Add this to your Hostinger VPS servers):
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILc4S5kHgJu4uyNUIIMueeVNY7RxhX0r2KOTOriTllCx goat-deploy
```

### Private Key (Add this to GitHub Secrets):
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACC3OEuZB4CbuLsjVCCDLnnlTWO0cYV9K9ijkzq4k5ZQsQAAAJDJkcteyZHL
XgAAAAtzc2gtZWQyNTUxOQAAACC3OEuZB4CbuLsjVCCDLnnlTWO0cYV9K9ijkzq4k5ZQsQ
AAAEAwGRXfMHWnqSjFR+o4olZtUclRnav/9IoyjE1asEUlIbc4S5kHgJu4uyNUIIMueeVN
Y7RxhX0r2KOTOriTllCxAAAAC2dvYXQtZGVwbG95AQI=
-----END OPENSSH PRIVATE KEY-----
```

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

Go to: **https://github.com/DJSPEEDYGA/nextjs-commerce/settings/secrets/actions**

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
curl -fsSL https://raw.githubusercontent.com/DJSPEEDYGA/nextjs-commerce/main/jetson-complete-deploy.sh | bash
```

---

## Step 5: Trigger Deployment

After setting up secrets, trigger deployment:

```bash
gh workflow run "deploy.yml" --repo DJSPEEDYGA/nextjs-commerce -f target=all
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
gh run list --repo DJSPEEDYGA/nextjs-commerce --limit 5

# View workflow logs
gh run view --repo DJSPEEDYGA/nextjs-commerce

# Trigger manual deployment
gh workflow run "deploy.yml" --repo DJSPEEDYGA/nextjs-commerce

# SSH to VPS #1
ssh -i ~/.ssh/goat_deploy_key root@72.61.193.184

# SSH to VPS #2
ssh -i ~/.ssh/goat_deploy_key root@93.127.214.171
```