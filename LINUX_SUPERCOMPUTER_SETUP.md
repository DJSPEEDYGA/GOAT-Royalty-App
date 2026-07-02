# 🐧 GOAT Royalties - Linux Supercomputer Setup
## For Your 8x NVIDIA Jetson Orin NX Cluster (2,200 TOPS!)

---

## 🚀 QUICK START (Linux Terminal)

Open your terminal and run these commands:

```bash
# 1. Clone the repository
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git

# 2. Enter the directory
cd nextjs-commerce

# 3. Install Node.js dependencies
npm install

# 4. Start the server
npm start
```

**Then open your browser to: http://localhost:3000**

---

## 📥 Option 2: Download the Linux App

### AppImage (Recommended for Linux)
```bash
# Download the AppImage (from your supercomputer)
wget https://sites.super.myninja.ai/ded9966f-cabf-45d4-8882-ef2a965c9895/310f6eaa/downloads/Super-GOAT-Royalty-2.0.0.AppImage

# Make it executable
chmod +x Super-GOAT-Royalty-2.0.0.AppImage

# Run it!
./Super-GOAT-Royalty-2.0.0.AppImage
```

### DEB Package (Debian/Ubuntu)
```bash
# Download the .deb file
wget https://sites.super.myninja.ai/ded9966f-cabf-45d4-8882-ef2a965c9895/310f6eaa/downloads/Super-GOAT-Royalty-2.0.0.deb

# Install it
sudo dpkg -i Super-GOAT-Royalty-2.0.0.deb

# Fix any missing dependencies
sudo apt-get install -f

# Run it (look for GOAT Royalties in your apps menu)
```

---

## 🐳 Option 3: Docker (Best for Production)

```bash
# Make sure Docker is installed
docker --version

# Clone and run with Docker
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git
cd nextjs-commerce

# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the server
docker-compose down
```

---

## 🖥️ Running on Your Jetson Cluster

### For Maximum AI Power:

```bash
# SSH into your Jetson
ssh username@jetson-ip-address

# Clone the repo
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git
cd nextjs-commerce

# Install (may need to use npm instead of yarn on Jetson)
npm install

# Start the server
PORT=3000 npm start

# Access from any computer on your network:
# http://jetson-ip-address:3000
```

### To Run on All 8 Jetson Units (Cluster Mode):

1. **On the main Jetson (Master)**:
```bash
npm start
```

2. **On other Jetson units**: They can connect to the master's API

---

## 🔧 System Requirements

| Requirement | Minimum | Recommended |
|------------|---------|-------------|
| RAM | 4GB | 8GB+ |
| Node.js | v18+ | v20+ |
| Storage | 500MB | 1GB |
| OS | Linux x64 | Ubuntu 22.04 |

---

## 🐛 Troubleshooting

### "npm: command not found"
```bash
# Install Node.js on Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### "Port 3000 is already in use"
```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill it
sudo kill -9 <PID>

# Or use a different port
PORT=3001 npm start
```

### "Permission denied"
```bash
# Make scripts executable
chmod +x *.sh

# Or run with sudo (not recommended for npm)
sudo npm start
```

---

## 💬 Talking to NEMO

Once running, NEMO is available in the chat panel. Try asking:
- "Show me the catalog"
- "What's OG's total works?"
- "What hardware is available?"
- "Tell me about the AI agents"

---

## 🚀 One-Liner Quick Start

```bash
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git && cd nextjs-commerce && npm install && npm start
```

---

**Your Supercomputer is ready to GOAT! 🐐⚡**