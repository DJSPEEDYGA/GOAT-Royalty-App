# SUPER GOAT ROYALTIES - Build Guide

## Version 5.1.0

The ultimate AI-powered creator platform with NVIDIA NIM, LangChain, RAG & Autonomous Agents.

---

## Quick Start - Copy & Paste Build Script

### Linux / macOS:
```bash
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git goat-royalties
cd goat-royalties
chmod +x BUILD_AND_RUN.sh && ./BUILD_AND_RUN.sh
```

### Windows (PowerShell):
```powershell
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git goat-royalties
cd goat-royalties
npm install --legacy-peer-deps
npm run electron:build:win
```

---

## Available Build Formats

| Format | Platform | File | Size |
|--------|----------|------|------|
| **Portable EXE** | Windows | `SUPER-GOAT-ROYALTIES-Portable-5.1.0.exe` | ~88 MB |
| **Windows ZIP** | Windows | `SUPER-GOAT-ROYALTIES-Windows-5.1.0.zip` | ~153 MB |
| **AppImage** | Linux | `SUPER-GOAT-ROYALTIES-5.1.0-x86_64.AppImage` | ~147 MB |
| **DMG** | macOS | `SUPER-GOAT-ROYALTIES-5.1.0.dmg` | Build on macOS |
| **NSIS Installer** | Windows | `SUPER-GOAT-ROYALTIES-Setup-5.1.0.exe` | Build on Windows/macOS |

---

## Build Commands

```bash
# Install dependencies
npm install --legacy-peer-deps

# Development mode
npm run dev

# Run Electron app in development
npm run electron:dev

# Build for Windows (Portable + NSIS)
npm run electron:build:win

# Build for macOS (DMG)
npm run electron:build:mac

# Build for Linux (AppImage + DEB)
npm run electron:build:linux

# Build for all platforms
npm run electron:build:all
```

---

## Platform-Specific Notes

### Windows
- **Portable EXE**: Works on any Windows machine, no installation required
- **NSIS Installer**: Requires Windows or macOS with proper signing tools

### macOS
- DMG builds require a macOS machine
- Code signing requires Apple Developer certificate

### Linux
- AppImage is portable and works on most Linux distributions
- DEB package for Debian/Ubuntu-based systems

---

## Features

- **Royalty Tracking**: Track and manage music royalties
- **Blockchain Integration**: Secure royalty payments on blockchain
- **Crypto Mining**: Built-in crypto mining capabilities
- **DSP Distribution**: Distribute to all major streaming platforms
- **Video Editing**: AI-powered video editing tools
- **AI Integration**: NVIDIA NIM, LangChain, RAG, Autonomous Agents
- **No Login Required**: Standalone app, all tools ready to use

---

## Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB for app, additional for projects

---

## Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Build fails on Linux for Windows
```bash
# Install wine for Windows builds on Linux
sudo apt-get install wine wine64
```

### Electron won't start
```bash
# Clear Electron cache
rm -rf ~/.cache/electron
rm -rf ~/.cache/electron-builder
```

---

## Author

**DJSPEEDYGA**
- Email: djspeedyga@lifeimitatesart.org
- GitHub: https://github.com/DJSPEEDYGA

---

## License

MIT License - Copyright © 2024 DJSPEEDYGA