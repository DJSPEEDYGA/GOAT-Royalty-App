#!/bin/bash
# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║          GOAT ROYALTY APP - VPS #1 PRODUCTION SERVER SETUP                  ║
# ║                      Run this on: 72.61.193.184                             ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

set -e

echo "🐐 Setting up GOAT Royalty App on VPS #1 (Production)..."

# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx certbot python3-certbot-nginx

# Create app directory
mkdir -p /opt/goat-app
cd /opt/goat-app

# Clone repository
if [ -d ".git" ]; then
    git pull origin main
else
    git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git .
fi

# Install dependencies
npm install --production

# Setup systemd service
cat > /etc/systemd/system/goat-app.service << 'EOF'
[Unit]
Description=GOAT Royalty App - Production Server
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/goat-app
Environment=NODE_ENV=production
Environment=SERVER_ROLE=production
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Setup Nginx reverse proxy
cat > /etc/nginx/sites-available/goat-app << 'EOF'
server {
    listen 80;
    server_name 72.61.193.184;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/goat-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# Enable services
systemctl daemon-reload
systemctl enable goat-app
systemctl start goat-app

# Setup firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo ""
echo "✅ VPS #1 Setup Complete!"
echo "🌐 Access your app at: http://72.61.193.184"
echo ""
echo "To check status: systemctl status goat-app"
echo "To view logs: journalctl -u goat-app -f"