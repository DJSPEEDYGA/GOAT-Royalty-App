# 🐐 GOAT ROYALTY APP - DEPLOYMENT ARCHITECTURE

## Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          GITHUB (Source of Truth)                           │
│                    DJSPEEDYGA/nextjs-commerce                               │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Source     │  │    Data     │  │   Deploy    │  │  Workflows  │        │
│  │   Code      │  │    Files    │  │  Scripts    │  │  (CI/CD)    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
        │   VPS #1      │  │   VPS #2      │  │   JETSON      │
        │ (KVM 2)       │  │ (KVM 8)       │  │ (AGX Orin)    │
        │               │  │               │  │               │
        │ 72.61.193.184 │  │93.127.214.171 │  │  LOCAL IP     │
        │               │  │               │  │               │
        │ - Web Server  │  │ - Database    │  │ - AI Engine   │
        │ - API Gateway │  │ - Storage     │  │ - Processing  │
        │ - Production  │  │ - Backup      │  │ - Development │
        └───────────────┘  └───────────────┘  └───────────────┘
                │                  │                  │
                └──────────────────┼──────────────────┘
                                   │
                            ┌──────▼──────┐
                            │   LOCAL     │
                            │  MACHINE    │
                            │             │
                            │ 2x RTX 3090 │
                            │ Development │
                            └─────────────┘
```

## Server Roles

### 1. VPS #1 (72.61.193.184) - Production Server
- **Role**: Primary web server & API gateway
- **Port**: 80/443 (HTTPS)
- **Services**:
  - GOAT App web interface
  - REST API endpoints
  - SSL/TLS termination
  - Rate limiting & security

### 2. VPS #2 (93.127.214.171) - Data & Backup Server
- **Role**: Database, storage, and backup
- **Port**: 5432 (PostgreSQL), 6379 (Redis)
- **Services**:
  - PostgreSQL database
  - Redis cache
  - File storage
  - Automated backups
  - Data synchronization

### 3. Jetson AGX Orin 64GB - AI Processing Unit
- **Role**: Local AI inference & development
- **Port**: 3000 (local network)
- **Services**:
  - Ollama AI models
  - Voice processing
  - GPU acceleration
  - Offline operation

### 4. Local Machine (2x RTX 3090) - Development
- **Role**: Heavy development & training
- **Services**:
  - Code development
  - Model training
  - Video rendering
  - GPU-intensive tasks

## Data Flow Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA SYNC PIPELINE                               │
└────────────────────────────────────────────────────────────────────────┘

     GitHub Push
          │
          ▼
    ┌──────────┐
    │ GitHub   │──────► GitHub Actions Workflow
    │ Actions  │        - Run tests
    │          │        - Build artifacts
    │          │        - Trigger deployments
    └──────────┘
          │
          ├──────────────────────┬──────────────────────┐
          ▼                      ▼                      ▼
    ┌──────────┐          ┌──────────┐          ┌──────────┐
    │  VPS #1  │          │  VPS #2  │          │  Jetson  │
    │ Deploy   │          │ Sync     │          │ Update   │
    │          │          │          │          │          │
    │ - Pull   │          │ - Backup │          │ - Pull   │
    │ - Build  │          │ - Store  │          │ - Restart│
    │ - Restart│          │ - Sync   │          │          │
    └──────────┘          └──────────┘          └──────────┘
```

## Automated Deployment Triggers

| Event | VPS #1 | VPS #2 | Jetson |
|-------|--------|--------|--------|
| Push to `main` | Auto-deploy | Sync data | Pull notification |
| Push to `dev` | No action | No action | Auto-deploy |
| Tag release | Full deploy | Full backup | Full update |
| Manual trigger | Deploy | Sync | Update |

## Security Configuration

### VPS #1 (Production)
```bash
# Firewall rules
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable

# SSL via Let's Encrypt
certbot --nginx -d goat-royalty.com
```

### VPS #2 (Database)
```bash
# Firewall rules (only allow VPS #1 and Jetson)
ufw allow from 72.61.193.184 to any port 5432
ufw allow from 72.61.193.184 to any port 6379
ufw allow 22/tcp
ufw enable
```

### Jetson (Local)
```bash
# Local network only
ufw allow from 192.168.1.0/24 to any port 3000
ufw allow 22/tcp
ufw enable
```

## Environment Variables

Each server has its own `.env` configuration:

### VPS #1 (Production)
```env
NODE_ENV=production
SERVER_ROLE=production
DATABASE_URL=postgresql://user:pass@93.127.214.171:5432/goat_db
REDIS_URL=redis://93.127.214.171:6379
AI_ENDPOINT=http://jetson-local:3000/api/ai
```

### VPS #2 (Database)
```env
NODE_ENV=production
SERVER_ROLE=database
POSTGRES_DB=goat_db
POSTGRES_USER=goat_admin
REDIS_MAXMEMORY=2gb
```

### Jetson (AI)
```env
NODE_ENV=production
SERVER_ROLE=ai-engine
JETSON_MODE=64GB
DATABASE_URL=postgresql://user:pass@93.127.214.171:5432/goat_db
```