#!/bin/bash
# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║              GOAT ROYALTY APP - SSH SETUP FOR ALL SERVERS                   ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║              🔐 GOAT APP - SSH KEY SETUP FOR DEPLOYMENT                     ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Server Configuration
VPS1_HOST="72.61.193.184"
VPS2_HOST="93.127.214.171"

# Generate SSH key if not exists
SSH_KEY="$HOME/.ssh/goat_deploy_key"
if [ ! -f "$SSH_KEY" ]; then
    echo -e "${YELLOW}Generating new SSH key for GOAT deployment...${NC}"
    ssh-keygen -t ed25519 -C "goat-deploy" -f "$SSH_KEY" -N ""
    echo -e "${GREEN}✅ SSH key generated: $SSH_KEY${NC}"
else
    echo -e "${GREEN}✅ SSH key already exists: $SSH_KEY${NC}"
fi

# Display public key
echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📋 PUBLIC KEY (Add this to your servers):${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════════════════════${NC}"
cat "${SSH_KEY}.pub"
echo -e "${CYAN}════════════════════════════════════════════════════════════════════════════${NC}"

# Instructions for Hostinger VPS
echo ""
echo -e "${YELLOW}📝 SETUP INSTRUCTIONS:${NC}"
echo ""
echo -e "${CYAN}For Hostinger VPS (via hPanel):${NC}"
echo "1. Go to: https://hpanel.hostinger.com"
echo "2. Navigate to: VPS → Your Server → Settings → SSH Keys"
echo "3. Click 'Add SSH Key'"
echo "4. Paste the public key above"
echo "5. Repeat for both servers"
echo ""

# Test SSH connection
echo -e "${YELLOW}🔐 To test SSH connection after adding keys:${NC}"
echo "  ssh -i $SSH_KEY root@$VPS1_HOST"
echo "  ssh -i $SSH_KEY root@$VPS2_HOST"
echo ""

# GitHub Secrets Setup
echo -e "${YELLOW}🔐 GITHUB SECRETS SETUP:${NC}"
echo ""
echo "Add these secrets to your GitHub repository:"
echo "Settings → Secrets and variables → Actions → New repository secret"
echo ""
echo -e "${GREEN}Required Secrets:${NC}"
echo "  VPS1_HOST = $VPS1_HOST"
echo "  VPS1_USER = root"
echo "  VPS1_SSH_KEY = (contents of $SSH_KEY)"
echo ""
echo "  VPS2_HOST = $VPS2_HOST"
echo "  VPS2_USER = root"
echo "  VPS2_SSH_KEY = (contents of $SSH_KEY)"
echo ""

# Print private key for GitHub secret
echo -e "${CYAN}════════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📋 PRIVATE KEY (For GitHub Secret - keep this secure!):${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════════════════════${NC}"
cat "$SSH_KEY"
echo -e "${CYAN}════════════════════════════════════════════════════════════════════════════${NC}"