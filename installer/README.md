# 📦 SUPER GOAT ROYALTIES APP - Installer Builder

Complete installer creation system for your music royalty management platform. Creates professional installers for Windows, macOS, Linux, and portable versions.

## 🚀 Quick Start

```bash
# Clone your repository
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git
cd nextjs-commerce/installer

# Make build script executable
chmod +x build-all.sh

# Build all installers
./build-all.sh --all

# Or build specific platforms
./build-all.sh --windows    # Windows only
./build-all.sh --macos      # macOS only
./build-all.sh --linux      # Linux only
./build-all.sh --portable   # Portable only
```

## 📋 Prerequisites

### Required (All Platforms)
- Node.js 14+ and npm
- Bash shell (Linux/macOS/WSL on Windows)

### Platform-Specific Tools

#### Windows (.exe)
```bash
# Ubuntu/Debian
sudo apt install nsis

# Fedora
sudo dnf install nsis

# Arch Linux
sudo pacman -S nsis

# macOS
brew install nsis
```

#### macOS (.dmg)
*Must be built on macOS for native DMG creation*
- Xcode Command Line Tools: `xcode-select --install`
- Optional: `brew install create-dmg`

#### Linux (.deb)
```bash
# Ubuntu/Debian (usually pre-installed)
sudo apt install dpkg-dev

# Fedora
sudo dnf install dpkg-dev
```

## 📁 Output Structure

After running the build script, you'll find:

```
dist/
├── portable/
│   ├── super-goat-royalties-1.0.0-portable.tar.gz
│   └── super-goat-royalties-1.0.0-portable.zip
│
├── windows/
│   ├── installer/
│   │   ├── server.js
│   │   ├── package.json
│   │   └── [all app files]
│   ├── installer.nsi          # NSIS script
│   ├── install.ps1            # PowerShell installer
│   └── build.sh               # Build script
│
├── macos/
│   ├── SUPER GOAT ROYALTIES APP.app/
│   ├── super-goat-royalties-1.0.0-macos.zip
│   └── create-dmg.sh          # DMG creation script
│
└── linux/
    ├── super-goat-royalties_1.0.0_amd64.deb
    ├── super-goat-royalties-1.0.0-linux.tar.gz
    └── appimage/              # AppImage structure
```

## 🪟 Windows Installer

### Option 1: NSIS Installer (.exe)
```bash
cd dist/windows
./build.sh
```

This creates: `super-goat-royalties-1.0.0-setup.exe`

### Option 2: PowerShell Installer
```powershell
# On Windows
cd dist/windows/installer
powershell -ExecutionPolicy Bypass -File install.ps1
```

### Option 3: ZIP Archive
If NSIS is not available, a ZIP archive is created automatically.

## 🍎 macOS Installer

### On macOS:
```bash
cd dist/macos
./create-dmg.sh
```

### On Linux:
A ZIP archive is created instead, which users can extract and run.

## 🐧 Linux Packages

### .deb Package (Ubuntu/Debian)
```bash
# Install
sudo dpkg -i super-goat-royalties_1.0.0_amd64.deb

# Or with apt (handles dependencies)
sudo apt install ./super-goat-royalties_1.0.0_amd64.deb

# Run
super-goat-royalties
```

### AppImage
```bash
# Make executable
chmod +x super-goat-royalties.AppImage

# Run
./super-goat-royalties.AppImage
```

## 📦 Portable Version

The portable version requires no installation:

```bash
# Linux/Mac
tar -xzf super-goat-royalties-1.0.0-portable.tar.gz
cd super-goat-royalties-1.0.0-portable
./start-linux.sh  # or ./start-macos.command

# Windows
# Extract the .zip file
# Double-click start-windows.bat
```

## 🔧 Build Options

```bash
# Build all platforms
./build-all.sh --all

# Build specific platforms
./build-all.sh --windows
./build-all.sh --macos
./build-all.sh --linux
./build-all.sh --portable

# Combine options
./build-all.sh --windows --portable

# Set version
./build-all.sh --version 2.0.0 --all

# Clean before build
./build-all.sh --clean --all

# Help
./build-all.sh --help
```

## ⚙️ Configuration

Edit these variables in `build-all.sh`:

```bash
APP_NAME="SUPER GOAT ROYALTIES APP"
APP_VERSION="1.0.0"
PACKAGE_NAME="super-goat-royalties"
```

## 🎯 Self-Healing System

The self-healing system is included in all packages. It will:
- Monitor application health
- Auto-restart on crashes
- Log all system events
- Recover from common errors

Users can configure it via the `.env` file:
```env
SELF_HEALING_ENABLED=true
HEALTH_CHECK_INTERVAL=30000
MAX_RESTART_ATTEMPTS=5
```

## 📤 Distribution

### Recommended Platforms:

1. **GitHub Releases** (Free)
   ```bash
   # Create a release
   gh release create v1.0.0 dist/* --title "v1.0.0" --notes "First release"
   ```

2. **AWS S3** (Pay per use)
   ```bash
   aws s3 sync dist/ s3://your-bucket/downloads/
   ```

3. **DigitalOcean Spaces** ($5/month)
   ```bash
   s3cmd sync dist/ s3://your-space/downloads/
   ```

4. **Your Own Server**
   - Upload files via FTP/SCP
   - Create download page
   - Track analytics

### File Sizes (Approximate):
- Windows EXE: ~50-100 MB
- macOS DMG: ~50-100 MB
- Linux .deb: ~50-100 MB
- Portable: ~50-100 MB

## 🔒 Security Considerations

1. **Code Signing** (Recommended for production)
   - Windows: Sign the .exe with a code signing certificate
   - macOS: Sign and notarize the .dmg with Apple Developer account
   - Linux: GPG sign the packages

2. **Environment Variables**
   - Never include sensitive API keys in the installer
   - Users must provide their own `.env` configuration

3. **Updates**
   - Implement auto-update mechanism
   - Use semantic versioning
   - Provide release notes with each update

## 🐛 Troubleshooting

### NSIS not found
```bash
# Install NSIS
sudo apt install nsis  # Ubuntu/Debian
sudo dnf install nsis  # Fedora
```

### dpkg-deb not available
```bash
sudo apt install dpkg-dev
```

### Permission denied
```bash
chmod +x build-all.sh
chmod +x dist/windows/build.sh
chmod +x dist/macos/create-dmg.sh
```

### Node.js not found on user's machine
- Portable version includes startup scripts that check for Node.js
- Windows/macOS installers check for Node.js and prompt user to install if missing
- Linux .deb package lists Node.js as a dependency

## 📚 Additional Resources

- [NSIS Documentation](https://nsis.sourceforge.io/Docs/)
- [Apple Code Signing Guide](https://developer.apple.com/support/code-signing/)
- [Debian Package Management](https://www.debian.org/doc/manuals/debian-faq/pkgtools.en.html)
- [AppImage Documentation](https://docs.appimage.org/)

## 📝 License

MIT License - See LICENSE file for details.

## 💬 Support

- GitHub Issues: https://github.com/DJSPEEDYGA/nextjs-commerce/issues
- Email: support@goatroyalty.com

---

**Built with ❤️ for the SUPER GOAT ROYALTIES APP**
