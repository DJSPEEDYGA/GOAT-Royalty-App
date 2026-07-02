# 🐹 GOAT Royalties - Local Setup Guide
## How to Download, Run & Talk to NEMO Locally on Your Computer

---

## 🚀 Option 1: Quick Download (Desktop App)

### Windows Users:
1. Go to: https://sites.super.myninja.ai/ded9966f-cabf-45d4-8882-ef2a965c9895/310f6eaa/downloads.html
2. Download **Super-GOAT-Royalty-2.0.0-Setup.exe** (for installation)
   - OR **Super-GOAT-Royalty-2.0.0-Portable.exe** (runs without installing)
3. Double-click to run the app!

### Linux Users:
1. Download **Super-GOAT-Royalty-2.0.0.AppImage**
2. Make it executable: `chmod +x Super-GOAT-Royalty-2.0.0.AppImage`
3. Run: `./Super-GOAT-Royalty-2.0.0.AppImage`

### macOS Users:
1. Download **Super-GOAT-Royalty-2.0.0.zip**
2. Extract and run the app inside

---

## 🖥️ Option 2: Run from Source Code (Developers)

### Prerequisites:
- **Node.js** installed (https://nodejs.org - download LTS version)
- **Git** installed (https://git-scm.com)

### Step-by-Step:

```bash
# 1. Clone the repository
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git
cd nextjs-commerce

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start the server
npm start

# 5. Open in browser
# Go to: http://localhost:3000
```

---

## 🐳 Option 3: Docker (Advanced)

### Prerequisites:
- Docker Desktop installed (https://www.docker.com/products/docker-desktop)

### Steps:

```bash
# 1. Clone the repository
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git
cd nextjs-commerce

# 2. Run with Docker Compose
docker-compose up -d

# 3. Open in browser
# Go to: http://localhost:3000
```

---

## 💬 How to Talk to NEMO Locally

### Once the app is running:

1. **Open the app** (desktop app OR browser at http://localhost:3000)
2. **Find the NEMO Chat panel** on the right side
3. **Type your message** and press Enter or click SEND
4. **NEMO will respond** with answers about:
   - Your royalties
   - Your catalog (877 works!)
   - Boss profiles (OG & Boss)
   - AI Agent status
   - Hardware cluster info

### NEMO Commands to Try:
- "Show me the catalog"
- "What's my total revenue?"
- "Who are the bosses?"
- "What AI agents are available?"
- "Tell me about my hardware"

---

## 🔧 For Your NVIDIA Jetson Cluster

### Running on Your 8x Jetson Orin NX:

```bash
# SSH into your Jetson
ssh your-username@jetson-ip

# Clone and run
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git
cd nextjs-commerce
npm install
npm start

# The app will use your Jetson's AI power (2,200 TOPS!)
```

### With NVIDIA NEMO:
Your Jetson cluster can run:
- **Local LLM** (Llama 3.2, Mistral)
- **Voice processing** locally
- **Real-time AI responses** without cloud

---

## 🌐 Access Points

| Method | URL | Best For |
|--------|-----|----------|
| **Desktop App** | Download from website | Easiest, no setup |
| **Local Source** | http://localhost:3000 | Development |
| **Docker** | http://localhost:3000 | Production-like |
| **Jetson** | http://jetson-ip:3000 | AI Power |
| **Live Website** | https://sites.super.myninja.ai/... | Anywhere |

---

## 🆘 Troubleshooting

### "npm install fails"
- Make sure Node.js is installed
- Try: `npm install --legacy-peer-deps`

### "Port 3000 already in use"
- Change port in .env file: `PORT=3001`
- Or kill the process using port 3000

### "Can't connect to server"
- Check if server is running: `npm start`
- Check firewall settings
- Try localhost instead of 127.0.0.1

---

## 📱 Next: Mobile App

See `GOAT_APP_MOBILE_DEVELOPMENT_GUIDE.md` for building the mobile version with:
- Voice-to-Voice AI
- Animated Avatar
- Real-time chat

---

**GOAT Royalties - Stay Paid and Play Harder! 🐐👑**