#!/bin/bash
# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║          GOAT ROYALTY APP - VPS #2 DATABASE SERVER SETUP                    ║
# ║                      Run this on: 93.127.214.171                            ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

set -e

echo "🐐 Setting up GOAT Royalty App on VPS #2 (Database)..."

# Update system
apt update && apt upgrade -y

# Install PostgreSQL and Redis
apt install -y postgresql postgresql-contrib redis-server git nodejs npm

# Configure PostgreSQL
sudo -u postgres psql << 'SQL'
CREATE DATABASE goat_db;
CREATE USER goat_admin WITH ENCRYPTED PASSWORD 'goat_secure_2024';
GRANT ALL PRIVILEGES ON DATABASE goat_db TO goat_admin;
ALTER USER goat_admin WITH SUPERUSER;
SQL

# Allow remote connections from VPS #1
echo "host all all 72.61.193.184/32 md5" >> /etc/postgresql/*/main/pg_hba.conf
echo "listen_addresses = '*'" >> /etc/postgresql/*/main/postgresql.conf
systemctl restart postgresql

# Configure Redis
sed -i 's/bind 127.0.0.1/bind 0.0.0.0/' /etc/redis/redis.conf
sed -i 's/# maxmemory <bytes>/maxmemory 2gb/' /etc/redis/redis.conf
systemctl restart redis-server

# Create app directory and sync data
mkdir -p /opt/goat-app/data
mkdir -p /opt/backups
cd /opt/goat-app

# Clone repository for data files
git clone https://github.com/DJSPEEDYGA/GOAT-Royalty-App.git .

# Setup backup script
cat > /opt/goat-app/scripts/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U goat_admin goat_db > $BACKUP_DIR/goat_db_$DATE.sql
tar -czf $BACKUP_DIR/goat_data_$DATE.tar.gz /opt/goat-app/data

find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF
chmod +x /opt/goat-app/scripts/backup.sh

# Add backup cron job (daily at 2 AM)
(crontab -l 2>/dev/null | grep -v "backup.sh"; echo "0 2 * * * /opt/goat-app/scripts/backup.sh >> /var/log/goat-backup.log 2>&1") | crontab -

# Setup firewall
ufw allow 22/tcp
ufw allow from 72.61.193.184 to any port 5432
ufw allow from 72.61.193.184 to any port 6379
ufw --force enable

echo ""
echo "✅ VPS #2 Setup Complete!"
echo "📊 PostgreSQL: goat_db (user: goat_admin)"
echo "⚡ Redis: Running on port 6379"
echo "💾 Backups: Daily at 2 AM"
echo ""
echo "Connection string for VPS #1:"
echo "postgresql://goat_admin:goat_secure_2024@93.127.214.171:5432/goat_db"