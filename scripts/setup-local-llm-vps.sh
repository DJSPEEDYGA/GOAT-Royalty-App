#!/bin/bash
# ============================================================
# SUPER GOAT ROYALTIES - Local LLM VPS Setup Script
# For Hostinger Ubuntu VPS
# ============================================================
#
# This script installs and configures:
# - Ollama (local LLM server)
# - NVIDIA CUDA (if GPU available)
# - Node.js & PM2 for app hosting
# - Nginx reverse proxy with SSL
# - Firewall configuration
#
# Usage: Copy and paste this entire script into your VPS terminal
#
# ============================================================

set -e

echo "============================================================"
echo "SUPER GOAT ROYALTIES - Local LLM VPS Setup"
echo "============================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
OLLAMA_PORT=11434
APP_PORT=3000
DOMAIN="${DOMAIN:-your-domain.com}"
EMAIL="${EMAIL:-admin@${DOMAIN}}"

# ============================================================
# STEP 1: System Update
# ============================================================
echo -e "${BLUE}Step 1: Updating system...${NC}"
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y curl wget git build-essential

# ============================================================
# STEP 2: Check for GPU
# ============================================================
echo -e "${BLUE}Step 2: Checking for GPU...${NC}"
if command -v nvidia-smi &> /dev/null; then
    echo -e "${GREEN}NVIDIA GPU detected!${NC}"
    nvidia-smi
    
    # Install NVIDIA Container Toolkit if using Docker
    distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
    curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
    curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
    sudo apt-get update
    sudo apt-get install -y nvidia-container-toolkit
    
    GPU_AVAILABLE=true
else
    echo -e "${YELLOW}No NVIDIA GPU detected. Will run in CPU mode.${NC}"
    echo -e "${YELLOW}For better performance, consider using a GPU VPS.${NC}"
    GPU_AVAILABLE=false
fi

# ============================================================
# STEP 3: Install Ollama
# ============================================================
echo -e "${BLUE}Step 3: Installing Ollama...${NC}"
if command -v ollama &> /dev/null; then
    echo -e "${GREEN}Ollama already installed${NC}"
else
    curl -fsSL https://ollama.ai/install.sh | sh
    echo -e "${GREEN}Ollama installed successfully${NC}"
fi

# Configure Ollama for network access
echo -e "${BLUE}Configuring Ollama for network access...${NC}"
sudo systemctl stop ollama 2>/dev/null || true

# Create systemd override for network access
sudo mkdir -p /etc/systemd/system/ollama.service.d
sudo tee /etc/systemd/system/ollama.service.d/override.conf > /dev/null << 'EOF'
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_ORIGINS=*"
EOF

sudo systemctl daemon-reload
sudo systemctl enable ollama
sudo systemctl start ollama

echo -e "${GREEN}Ollama configured and started${NC}"

# ============================================================
# STEP 4: Download Models
# ============================================================
echo -e "${BLUE}Step 4: Downloading AI models...${NC}"
echo -e "${YELLOW}This may take a while depending on model size...${NC}"

# Download recommended models
MODELS_TO_INSTALL="${MODELS:-llama3.3 mistral:7b}"

for model in $MODELS_TO_INSTALL; do
    echo -e "${BLUE}Downloading model: ${model}${NC}"
    ollama pull $model || echo -e "${YELLOW}Failed to pull ${model}, continuing...${NC}"
done

echo -e "${GREEN}Models downloaded:${NC}"
ollama list

# ============================================================
# STEP 5: Install Node.js
# ============================================================
echo -e "${BLUE}Step 5: Installing Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}Node.js ${NODE_VERSION} already installed${NC}"
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo -e "${GREEN}Node.js installed: $(node -v)${NC}"
fi

# Install PM2 for process management
sudo npm install -g pm2
echo -e "${GREEN}PM2 installed${NC}"

# ============================================================
# STEP 6: Install Nginx
# ============================================================
echo -e "${BLUE}Step 6: Installing Nginx...${NC}"
sudo apt-get install -y nginx

# Create Nginx configuration for the app
sudo tee /etc/nginx/sites-available/goat-royalties > /dev/null << 'EOF'
# Upstream for Ollama API
upstream ollama {
    server 127.0.0.1:11434;
}

# Upstream for GOAT App
upstream goat_app {
    server 127.0.0.1:3000;
}

# HTTP Server - Redirect to HTTPS
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER;
    
    # Allow Let's Encrypt challenges
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name DOMAIN_PLACEHOLDER;
    
    # SSL certificates (configure after certbot)
    ssl_certificate /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Ollama API endpoint
    location /ollama/ {
        proxy_pass http://ollama/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # GOAT App
    location / {
        proxy_pass http://goat_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Replace domain placeholder
sudo sed -i "s/DOMAIN_PLACEHOLDER/${DOMAIN}/g" /etc/nginx/sites-available/goat-royalties

# Enable the site
sudo ln -sf /etc/nginx/sites-available/goat-royalties /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

echo -e "${GREEN}Nginx configured${NC}"

# ============================================================
# STEP 7: Configure Firewall
# ============================================================
echo -e "${BLUE}Step 7: Configuring firewall...${NC}"
sudo apt-get install -y ufw

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
echo "y" | sudo ufw enable

echo -e "${GREEN}Firewall configured${NC}"

# ============================================================
# STEP 8: Install SSL Certificate
# ============================================================
echo -e "${BLUE}Step 8: Setting up SSL...${NC}"
sudo apt-get install -y certbot python3-certbot-nginx

# Create certbot webroot directory
sudo mkdir -p /var/www/certbot

echo -e "${YELLOW}To get SSL certificate, run:${NC}"
echo -e "  sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} -d api.${DOMAIN}"

# ============================================================
# STEP 9: Create Environment File
# ============================================================
echo -e "${BLUE}Step 9: Creating environment configuration...${NC}"
sudo mkdir -p /opt/goat-royalties

sudo tee /opt/goat-royalties/.env > /dev/null << 'EOF'
# GOAT Royalties App Configuration
NODE_ENV=production
PORT=3000

# Local LLM Configuration
OLLAMA_URL=http://localhost:11434
LOCAL_LLM_PROVIDER=ollama
LOCAL_LLM_MODEL=llama3.3

# Security (CHANGE THESE!)
JWT_SECRET=change-this-to-a-random-secret-key
ENCRYPTION_KEY=change-this-to-32-char-encryption-key

# Optional: External AI APIs
# NVIDIA_API_KEY=your-nvidia-api-key
# GOOGLE_AI_STUDIO_KEY=your-google-api-key
EOF

echo -e "${GREEN}Environment file created at /opt/goat-royalties/.env${NC}"
echo -e "${YELLOW}IMPORTANT: Edit this file to set secure keys!${NC}"

# ============================================================
# STEP 10: Create Start Script
# ============================================================
echo -e "${BLUE}Step 10: Creating startup scripts...${NC}"

sudo tee /opt/goat-royalties/start.sh > /dev/null << 'EOF'
#!/bin/bash
cd /opt/goat-royalties/app
source /opt/goat-royalties/.env
pm2 start server.js --name goat-royalties
pm2 save
EOF

sudo chmod +x /opt/goat-royalties/start.sh

echo -e "${GREEN}Startup script created${NC}"

# ============================================================
# Summary
# ============================================================
echo ""
echo "============================================================"
echo -e "${GREEN}Installation Complete!${NC}"
echo "============================================================"
echo ""
echo "Ollama Status:"
sudo systemctl status ollama --no-pager | head -5
echo ""
echo "Available Models:"
ollama list
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Upload your GOAT Royalties app to /opt/goat-royalties/app"
echo "2. Edit /opt/goat-royalties/.env with secure keys"
echo "3. Get SSL certificate: sudo certbot --nginx -d ${DOMAIN}"
echo "4. Start the app: /opt/goat-royalties/start.sh"
echo ""
echo "API Endpoints:"
echo "  - Ollama API: http://${DOMAIN}/ollama/"
echo "  - App API: http://${DOMAIN}/api/"
echo ""
echo "To add more models:"
echo "  ollama pull <model-name>"
echo ""
echo "============================================================"