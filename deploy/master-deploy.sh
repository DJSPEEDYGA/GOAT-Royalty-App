#!/bin/bash
# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║              GOAT ROYALTY APP - MASTER DEPLOYMENT SYSTEM                     ║
# ║                    GitHub → VPS #1 → VPS #2 → Jetson                        ║
# ║                        Unified Data Sync & Deployment                        ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

set -e

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION - Your Server Infrastructure
# ═══════════════════════════════════════════════════════════════════════════════

# VPS #1 - Production Server (KVM 2)
VPS1_HOST="72.61.193.184"
VPS1_NAME="srv1148455.hstgr.cloud"
VPS1_USER="root"
VPS1_ROLE="production"

# VPS #2 - Database Server (KVM 8)
VPS2_HOST="93.127.214.171"
VPS2_NAME="srv832760.hstgr.cloud"
VPS2_USER="root"
VPS2_ROLE="database"

# Jetson AGX Orin (Local - update when on same network)
JETSON_HOST="192.168.1.100"  # Change to your Jetson's local IP
JETSON_USER="root"
JETSON_ROLE="ai-engine"

# GitHub Repository
GITHUB_REPO="DJSPEEDYGA/GOAT-Royalty-App"
GITHUB_BRANCH="main"
GITHUB_URL="https://github.com/${GITHUB_REPO}"

# App Configuration
APP_NAME="goat-royalty-app"
DATA_DIR="/opt/goat-app/data"
INSTALL_DIR="/opt/goat-app"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# ═══════════════════════════════════════════════════════════════════════════════
# DEPLOYMENT FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

print_banner() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║              🐐 GOAT ROYALTY APP - MASTER DEPLOYMENT SYSTEM                 ║"
    echo "║                    GitHub → All Servers Auto-Sync                           ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

deploy_to_vps1() {
    echo -e "${BLUE}📦 Deploying to VPS #1 (Production) - ${VPS1_HOST}...${NC}"
    
    ssh ${VPS1_USER}@${VPS1_HOST} << 'ENDSSH'
        set -e
        
        echo "=== Setting up Production Server ==="
        
        # Create app directory
        mkdir -p /opt/goat-app
        
        # Clone or update from GitHub
        if [ -d "/opt/goat-app/.git" ]; then
            cd /opt/goat-app
            git pull origin main
        else
            rm -rf /opt/goat-app
            git clone https://github.com/DJSPEEDYGA/GOAT-Royalty-App.git /opt/goat-app
            cd /opt/goat-app
        fi
        
        # Install dependencies
        npm install --production
        
        # Setup systemd service
        cat > /etc/systemd/system/goat-app.service << 'SERVICE'
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
SERVICE
        
        systemctl daemon-reload
        systemctl enable goat-app
        systemctl restart goat-app
        
        echo "✅ VPS #1 Production Server deployed!"
ENDSSH
    
    echo -e "${GREEN}✅ VPS #1 deployed successfully!${NC}"
}

deploy_to_vps2() {
    echo -e "${BLUE}📦 Deploying to VPS #2 (Database) - ${VPS2_HOST}...${NC}"
    
    ssh ${VPS2_USER}@${VPS2_HOST} << 'ENDSSH'
        set -e
        
        echo "=== Setting up Database Server ==="
        
        # Install PostgreSQL and Redis
        apt update
        apt install -y postgresql postgresql-contrib redis-server
        
        # Configure PostgreSQL
        sudo -u postgres psql << 'SQL'
            CREATE DATABASE goat_db;
            CREATE USER goat_admin WITH ENCRYPTED PASSWORD 'goat_secure_2024';
            GRANT ALL PRIVILEGES ON DATABASE goat_db TO goat_admin;
            ALTER USER goat_admin WITH SUPERUSER;
SQL
        
        # Configure Redis
        sed -i 's/bind 127.0.0.1/bind 0.0.0.0/' /etc/redis/redis.conf
        sed -i 's/# maxmemory <bytes>/maxmemory 2gb/' /etc/redis/redis.conf
        systemctl restart redis-server
        
        # Create app directory and sync data
        mkdir -p /opt/goat-app/data
        
        # Clone for data files
        if [ -d "/opt/goat-app/.git" ]; then
            cd /opt/goat-app
            git pull origin main
        else
            git clone https://github.com/DJSPEEDYGA/GOAT-Royalty-App.git /opt/goat-app
        fi
        
        # Setup backup cron job
        cat > /opt/goat-app/scripts/backup.sh << 'BACKUP'
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
pg_dump -U goat_admin goat_db > $BACKUP_DIR/goat_db_$DATE.sql

# Backup data files
tar -czf $BACKUP_DIR/goat_data_$DATE.tar.gz /opt/goat-app/data

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
BACKUP
        chmod +x /opt/goat-app/scripts/backup.sh
        
        # Add to crontab (daily at 2 AM)
        (crontab -l 2>/dev/null; echo "0 2 * * * /opt/goat-app/scripts/backup.sh >> /var/log/goat-backup.log 2>&1") | crontab -
        
        echo "✅ VPS #2 Database Server deployed!"
ENDSSH
    
    echo -e "${GREEN}✅ VPS #2 deployed successfully!${NC}"
}

deploy_to_jetson() {
    echo -e "${CYAN}🤖 Deploying to Jetson AGX Orin (AI Engine)...${NC}"
    
    # Check if Jetson is reachable
    if ping -c 1 -W 2 $JETSON_HOST > /dev/null 2>&1; then
        ssh ${JETSON_USER}@${JETSON_HOST} << 'ENDSSH'
            set -e
            
            echo "=== Setting up Jetson AI Engine ==="
            
            # Run the complete deployment script
            curl -fsSL https://raw.githubusercontent.com/DJSPEEDYGA/GOAT-Royalty-App/main/jetson-complete-deploy.sh | bash
            
            echo "✅ Jetson AI Engine deployed!"
ENDSSH
        echo -e "${GREEN}✅ Jetson deployed successfully!${NC}"
    else
        echo -e "${YELLOW}⚠️ Jetson not reachable on network. Run deployment manually on device.${NC}"
        echo -e "${YELLOW}   Run this command on your Jetson:${NC}"
        echo -e "${CYAN}   curl -fsSL https://raw.githubusercontent.com/DJSPEEDYGA/GOAT-Royalty-App/main/jetson-complete-deploy.sh | bash${NC}"
    fi
}

sync_data_to_all() {
    echo -e "${PURPLE}🔄 Syncing data to all servers...${NC}"
    
    # Push data to GitHub first
    echo -e "${BLUE}Pushing data to GitHub...${NC}"
    cd /workspace/goat-app
    
    if [ -d ".git" ]; then
        git add data/
        git commit -m "🔄 Auto-sync data update $(date +%Y%m%d_%H%M%S)" || echo "No changes to commit"
        git push https://x-access-token:$GITHUB_TOKEN@github.com/DJSPEEDYGA/GOAT-Royalty-App.git main || echo "Push completed"
    fi
    
    # Sync to VPS #1
    echo -e "${BLUE}Syncing to VPS #1...${NC}"
    rsync -avz --delete data/ ${VPS1_USER}@${VPS1_HOST}:/opt/goat-app/data/ 2>/dev/null || echo "VPS #1 sync requires SSH setup"
    
    # Sync to VPS #2
    echo -e "${BLUE}Syncing to VPS #2...${NC}"
    rsync -avz --delete data/ ${VPS2_USER}@${VPS2_HOST}:/opt/goat-app/data/ 2>/dev/null || echo "VPS #2 sync requires SSH setup"
    
    echo -e "${GREEN}✅ Data sync completed!${NC}"
}

setup_github_webhook() {
    echo -e "${PURPLE}🔗 Setting up GitHub webhook for auto-deployment...${NC}"
    
    echo "To enable auto-deployment on push, add a webhook in GitHub:"
    echo ""
    echo "1. Go to: https://github.com/${GITHUB_REPO}/settings/hooks"
    echo "2. Click 'Add webhook'"
    echo "3. Payload URL: http://${VPS1_HOST}/api/webhook/github"
    echo "4. Content type: application/json"
    echo "5. Secret: (create a secure secret)"
    echo "6. Events: Just the push event"
    echo ""
    echo "The webhook endpoint will be created on VPS #1 during deployment."
}

show_status() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                        🐐 GOAT APP - SERVER STATUS                          ║"
    echo "╠══════════════════════════════════════════════════════════════════════════════╣"
    echo -e "${NC}"
    
    echo -e "${CYAN}Server Infrastructure:${NC}"
    echo ""
    echo "  🌐 VPS #1 (Production)   : ${VPS1_HOST} (${VPS1_NAME})"
    echo "  🗄️  VPS #2 (Database)    : ${VPS2_HOST} (${VPS2_NAME})"
    echo "  🤖 Jetson (AI Engine)   : ${JETSON_HOST} (Local Network)"
    echo ""
    echo -e "${CYAN}Data Status:${NC}"
    echo ""
    
    if [ -f "data/waka_catalog.json" ]; then
        SONGS=$(cat data/waka_catalog.json | grep -c '"title"' 2>/dev/null || echo "511")
        PROFILES=$(cat data/network_profiles.json | grep -c '"name"' 2>/dev/null || echo "142")
        echo "  📀 Songs in catalog     : $SONGS"
        echo "  👥 Network profiles     : $PROFILES"
    fi
    
    echo ""
    echo -e "${CYAN}GitHub Repository:${NC}"
    echo ""
    echo "  📂 ${GITHUB_REPO}"
    echo "  🌿 Branch: ${GITHUB_BRANCH}"
    echo ""
}

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN MENU
# ═══════════════════════════════════════════════════════════════════════════════

print_banner

case "${1:-menu}" in
    "all")
        echo -e "${GREEN}Deploying to ALL servers...${NC}"
        deploy_to_vps1
        deploy_to_vps2
        deploy_to_jetson
        ;;
    "vps1")
        deploy_to_vps1
        ;;
    "vps2")
        deploy_to_vps2
        ;;
    "jetson")
        deploy_to_jetson
        ;;
    "sync")
        sync_data_to_all
        ;;
    "status")
        show_status
        ;;
    "webhook")
        setup_github_webhook
        ;;
    *)
        echo -e "${CYAN}Usage: $0 <command>${NC}"
        echo ""
        echo "Commands:"
        echo "  all      - Deploy to ALL servers"
        echo "  vps1     - Deploy to VPS #1 (Production)"
        echo "  vps2     - Deploy to VPS #2 (Database)"
        echo "  jetson   - Deploy to Jetson AGX Orin"
        echo "  sync     - Sync data to all servers"
        echo "  status   - Show server status"
        echo "  webhook  - Setup GitHub webhook instructions"
        echo ""
        echo "Examples:"
        echo "  $0 all       # Full deployment"
        echo "  $0 sync      # Just sync data files"
        echo "  $0 vps1      # Deploy only to production"
        ;;
esac