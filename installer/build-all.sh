#!/bin/bash
#==============================================================================
# SUPER GOAT ROYALTIES APP - Master Build Script
# Creates all installer packages for distribution
#==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

APP_NAME="SUPER GOAT ROYALTIES APP"
APP_VERSION="1.0.0"
BUILD_DIR="./dist"
PACKAGE_NAME="super-goat-royalties"

echo -e "${PURPLE}======================================${NC}"
echo -e "${PURPLE}   SUPER GOAT ROYALTIES APP BUILDER   ${NC}"
echo -e "${PURPLE}======================================${NC}"
echo ""

# Parse arguments
BUILD_WINDOWS=false
BUILD_MACOS=false
BUILD_LINUX=false
BUILD_PORTABLE=false
CLEAN_BUILD=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --windows|-w)
            BUILD_WINDOWS=true
            shift
            ;;
        --macos|-m)
            BUILD_MACOS=true
            shift
            ;;
        --linux|-l)
            BUILD_LINUX=true
            shift
            ;;
        --portable|-p)
            BUILD_PORTABLE=true
            shift
            ;;
        --all|-a)
            BUILD_WINDOWS=true
            BUILD_MACOS=true
            BUILD_LINUX=true
            BUILD_PORTABLE=true
            shift
            ;;
        --clean|-c)
            CLEAN_BUILD=true
            shift
            ;;
        --version|-v)
            APP_VERSION="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -w, --windows    Build Windows installer"
            echo "  -m, --macos      Build macOS DMG"
            echo "  -l, --linux      Build Linux packages"
            echo "  -p, --portable   Build portable version"
            echo "  -a, --all        Build all packages"
            echo "  -c, --clean      Clean build directory first"
            echo "  -v, --version    Set version number (default: 1.0.0)"
            echo "  -h, --help       Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 --all                    # Build everything"
            echo "  $0 --windows --portable     # Build Windows and portable"
            echo "  $0 --version 2.0.0 --all    # Build version 2.0.0"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# If no specific build selected, build all
if [ "$BUILD_WINDOWS" = false ] && [ "$BUILD_MACOS" = false ] && [ "$BUILD_LINUX" = false ] && [ "$BUILD_PORTABLE" = false ]; then
    echo -e "${YELLOW}No build target specified. Building all packages...${NC}"
    BUILD_WINDOWS=true
    BUILD_MACOS=true
    BUILD_LINUX=true
    BUILD_PORTABLE=true
fi

# Clean build directory
if [ "$CLEAN_BUILD" = true ]; then
    echo -e "${YELLOW}Cleaning build directory...${NC}"
    rm -rf "$BUILD_DIR"
fi

# Create build directory structure
mkdir -p "$BUILD_DIR"/{windows,macos,linux,portable}
mkdir -p "$BUILD_DIR/temp"

echo -e "${GREEN}Build directory structure created${NC}"
echo ""

# Check required tools
echo -e "${CYAN}Checking build dependencies...${NC}"

check_tool() {
    if command -v "$1" &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} $1 found"
        return 0
    else
        echo -e "  ${RED}✗${NC} $1 not found"
        return 1
    fi
}

REQUIRED_TOOLS=("node" "npm")
MISSING_TOOLS=false

for tool in "${REQUIRED_TOOLS[@]}"; do
    if ! check_tool "$tool"; then
        MISSING_TOOLS=true
    fi
done

if [ "$MISSING_TOOLS" = true ]; then
    echo -e "${RED}Please install missing tools before continuing${NC}"
    exit 1
fi

echo ""

# Prepare application files
echo -e "${CYAN}Preparing application files...${NC}"

# Copy application files to temp directory
cp -r server.js "$BUILD_DIR/temp/" 2>/dev/null || true
cp -r package.json "$BUILD_DIR/temp/" 2>/dev/null || true
cp -r package-lock.json "$BUILD_DIR/temp/" 2>/dev/null || true
cp -r public "$BUILD_DIR/temp/" 2>/dev/null || true
cp -r views "$BUILD_DIR/temp/" 2>/dev/null || true
cp -r config "$BUILD_DIR/temp/" 2>/dev/null || true
cp -r lib "$BUILD_DIR/temp/" 2>/dev/null || true
cp -r routes "$BUILD_DIR/temp/" 2>/dev/null || true
cp -r api "$BUILD_DIR/temp/" 2>/dev/null || true
cp -r .env.example "$BUILD_DIR/temp/" 2>/dev/null || true
cp -r README.md "$BUILD_DIR/temp/" 2>/dev/null || true
cp -r LICENSE "$BUILD_DIR/temp/" 2>/dev/null || true

# Install production dependencies in temp
cd "$BUILD_DIR/temp"
npm install --production --silent 2>/dev/null || true
cd - > /dev/null

echo -e "${GREEN}Application files prepared${NC}"
echo ""

# Build functions
build_portable() {
    echo -e "${BLUE}══════════════════════════════════════${NC}"
    echo -e "${BLUE}  BUILDING PORTABLE VERSION           ${NC}"
    echo -e "${BLUE}══════════════════════════════════════${NC}"
    
    PORTABLE_DIR="$BUILD_DIR/portable/$PACKAGE_NAME-$APP_VERSION-portable"
    mkdir -p "$PORTABLE_DIR"
    
    # Copy all application files
    cp -r "$BUILD_DIR/temp/"* "$PORTABLE_DIR/"
    
    # Create startup scripts
    cat > "$PORTABLE_DIR/start-linux.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
./node/bin/node server.js
EOF
    chmod +x "$PORTABLE_DIR/start-linux.sh"
    
    cat > "$PORTABLE_DIR/start-windows.bat" << 'EOF'
@echo off
cd /d "%~dp0"
node\windows\node.exe server.js
pause
EOF
    
    cat > "$PORTABLE_DIR/start-macos.command" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
./node/bin/node server.js
EOF
    chmod +x "$PORTABLE_DIR/start-macos.command"
    
    # Create README for portable
    cat > "$PORTABLE_DIR/README-PORTABLE.txt" << EOF
=====================================
SUPER GOAT ROYALTIES APP v$APP_VERSION
PORTABLE EDITION
=====================================

QUICK START:
------------

Windows:
  Double-click start-windows.bat

Linux/Mac:
  Open terminal in this folder
  Run: ./start-linux.sh (Linux) or ./start-macos.command (Mac)

ACCESS THE APP:
---------------
Open your browser to: http://localhost:3000

FEATURES:
---------
• 242 API Endpoints
• 6 AI Engines Integrated
• Voice Commands
• Real-time Dashboard
• Self-Healing System

CONFIGURATION:
--------------
Edit .env file with your API keys

SUPPORT:
--------
GitHub: https://github.com/DJSPEEDYGA/nextjs-commerce

=====================================
EOF
    
    # Create tarball
    tar -czf "$BUILD_DIR/portable/$PACKAGE_NAME-$APP_VERSION-portable.tar.gz" -C "$BUILD_DIR/portable" "$PACKAGE_NAME-$APP_VERSION-portable"
    
    # Create ZIP for Windows users
    cd "$BUILD_DIR/portable"
    zip -r -q "$PACKAGE_NAME-$APP_VERSION-portable.zip" "$PACKAGE_NAME-$APP_VERSION-portable"
    cd - > /dev/null
    
    echo -e "${GREEN}✓ Portable version created${NC}"
    echo -e "  ${CYAN}Location:${NC} $BUILD_DIR/portable/"
    echo -e "  ${CYAN}Files:${NC}"
    echo -e "    - $PACKAGE_NAME-$APP_VERSION-portable.tar.gz"
    echo -e "    - $PACKAGE_NAME-$APP_VERSION-portable.zip"
    echo ""
}

build_windows() {
    echo -e "${BLUE}══════════════════════════════════════${NC}"
    echo -e "${BLUE}  BUILDING WINDOWS INSTALLER          ${NC}"
    echo -e "${BLUE}══════════════════════════════════════${NC}"
    
    WINDOWS_DIR="$BUILD_DIR/windows"
    INSTALLER_DIR="$WINDOWS_DIR/installer"
    mkdir -p "$INSTALLER_DIR"
    
    # Copy application files
    cp -r "$BUILD_DIR/temp/"* "$INSTALLER_DIR/"
    
    # Create NSIS installer script
    cat > "$WINDOWS_DIR/installer.nsi" << EOF
!include "MUI2.nsh"
!include "FileFunc.nsh"

!define APP_NAME "SUPER GOAT ROYALTIES APP"
!define APP_VERSION "$APP_VERSION"
!define APP_PUBLISHER "GOAT Royalty"
!define APP_EXE "server.js"
!define APP_URL "https://github.com/DJSPEEDYGA/nextjs-commerce"

Name "\${APP_NAME} \${APP_VERSION}"
OutFile "..\\$PACKAGE_NAME-$APP_VERSION-setup.exe"
InstallDir "\$PROGRAMFILES64\\GOAT Royalty"
InstallDirRegKey HKLM "Software\\GOAT Royalty" "Install_Dir"
RequestExecutionLevel admin

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "..\\..\\LICENSE"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

Section "Install"
    SetOutPath "\$INSTDIR"
    
    ; Copy all files
    File /r "installer\\*.*"
    
    ; Create uninstaller
    WriteUninstaller "\$INSTDIR\\uninstall.exe"
    
    ; Create shortcuts
    CreateDirectory "\$SMPROGRAMS\\GOAT Royalty"
    CreateShortCut "\$SMPROGRAMS\\GOAT Royalty\\SUPER GOAT ROYALTIES APP.lnk" "\$INSTDIR\\start.bat"
    CreateShortCut "\$SMPROGRAMS\\GOAT Royalty\\Uninstall.lnk" "\$INSTDIR\\uninstall.exe"
    
    ; Create desktop shortcut
    CreateShortCut "\$DESKTOP\\SUPER GOAT ROYALTIES APP.lnk" "\$INSTDIR\\start.bat"
    
    ; Write registry keys
    WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\GOAT Royalty" "DisplayName" "\${APP_NAME}"
    WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\GOAT Royalty" "UninstallString" '"\$INSTDIR\\uninstall.exe"'
    WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\GOAT Royalty" "Publisher" "\${APP_PUBLISHER}"
    WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\GOAT Royalty" "DisplayVersion" "\${APP_VERSION}"
    
    ; Calculate and write installed size
    \${GetSize} "\$INSTDIR" "/S=0K" \$0
    IntFmt \$0 "0x%08X" \$0
    WriteRegDWORD HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\GOAT Royalty" "EstimatedSize" "\$0"
    
    ; Create start batch file
    FileOpen \$0 "\$INSTDIR\\start.bat" w
    FileWrite \$0 "@echo off$\r$\n"
    FileWrite \$0 "cd /d %~dp0$\r$\n"
    FileWrite \$0 "echo Starting SUPER GOAT ROYALTIES APP...$\r$\n"
    FileWrite \$0 "echo.$\r$\n"
    FileWrite \$0 "echo Application running at: http://localhost:3000$\r$\n"
    FileWrite \$0 "echo.$\r$\n"
    FileWrite \$0 "echo Press Ctrl+C to stop the server$\r$\n"
    FileWrite \$0 "node server.js$\r$\n"
    FileWrite \$0 "pause$\r$\n"
    FileClose \$0
    
    DetailPrint "Installation Complete!"
    DetailPrint "Access your app at: http://localhost:3000"
SectionEnd

Section "Uninstall"
    Delete "\$INSTDIR\\*.*"
    RMDir /r "\$INSTDIR"
    Delete "\$SMPROGRAMS\\GOAT Royalty\\*.*"
    RMDir "\$SMPROGRAMS\\GOAT Royalty"
    Delete "\$DESKTOP\\SUPER GOAT ROYALTIES APP.lnk"
    DeleteRegKey HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\GOAT Royalty"
    DeleteRegKey HKLM "Software\\GOAT Royalty"
SectionEnd
EOF
    
    # Create PowerShell installer as alternative
    cat > "$WINDOWS_DIR/install.ps1" << 'EOF'
# SUPER GOAT ROYALTIES APP - PowerShell Installer
param(
    [string]$InstallPath = "$env:LOCALAPPDATA\GOAT Royalty",
    [switch]$Silent
)

$ErrorActionPreference = "Stop"
$AppName = "SUPER GOAT ROYALTIES APP"
$Version = "1.0.0"

if (-not $Silent) {
    Write-Host "======================================" -ForegroundColor Purple
    Write-Host "  SUPER GOAT ROYALTIES APP INSTALLER  " -ForegroundColor Purple
    Write-Host "======================================" -ForegroundColor Purple
    Write-Host ""
}

# Check for Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is required. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Create installation directory
if (-not (Test-Path $InstallPath)) {
    New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
}

# Copy files
Write-Host "Installing $AppName..." -ForegroundColor Cyan
Copy-Item -Path ".\*" -Destination $InstallPath -Recurse -Force

# Create desktop shortcut
$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut = $WScriptShell.CreateShortcut("$env:USERPROFILE\Desktop\$AppName.lnk")
$Shortcut.TargetPath = "$InstallPath\start.bat"
$Shortcut.WorkingDirectory = $InstallPath
$Shortcut.Description = "$AppName - Music Royalty Management Platform"
$Shortcut.Save()

# Create start menu shortcut
$StartMenuPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs"
if (-not (Test-Path "$StartMenuPath\GOAT Royalty")) {
    New-Item -ItemType Directory -Path "$StartMenuPath\GOAT Royalty" -Force | Out-Null
}
$Shortcut = $WScriptShell.CreateShortcut("$StartMenuPath\GOAT Royalty\$AppName.lnk")
$Shortcut.TargetPath = "$InstallPath\start.bat"
$Shortcut.Save()

# Create start.bat
$startBat = "@echo off`ncd /d `"$InstallPath`"`necho Starting $AppName...`necho.`necho Application running at: http://localhost:3000`necho.`necho Press Ctrl+C to stop the server`nnode server.js`npause"
$startBat | Out-File -FilePath "$InstallPath\start.bat" -Encoding ASCII

# Register uninstaller
$UninstallRegPath = "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\GOAT Royalty"
if (-not (Test-Path $UninstallRegPath)) {
    New-Item -Path $UninstallRegPath -Force | Out-Null
}
Set-ItemProperty -Path $UninstallRegPath -Name "DisplayName" -Value $AppName
Set-ItemProperty -Path $UninstallRegPath -Name "DisplayVersion" -Value $Version
Set-ItemProperty -Path $UninstallRegPath -Name "Publisher" -Value "GOAT Royalty"
Set-ItemProperty -Path $UninstallRegPath -Name "UninstallString" -Value "$InstallPath\uninstall.exe"
Set-ItemProperty -Path $UninstallRegPath -Name "InstallLocation" -Value $InstallPath

Write-Host ""
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "Access your app at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Shortcuts created:" -ForegroundColor Yellow
Write-Host "  - Desktop: $AppName.lnk"
Write-Host "  - Start Menu: GOAT Royalty\$AppName.lnk"
EOF
    
    # Create build script for Windows
    cat > "$WINDOWS_DIR/build.sh" << 'EOF'
#!/bin/bash
# Build Windows installer on Linux

echo "Building Windows installer..."
echo ""
echo "Required: NSIS (Nullsoft Scriptable Install System)"
echo "Install on Ubuntu/Debian: sudo apt install nsis"
echo "Install on Fedora: sudo dnf install nsis"
echo "Install on Arch: sudo pacman -S nsis"
echo ""

if command -v makensis &> /dev/null; then
    makensis installer.nsi
    echo ""
    echo "✓ Windows installer created: $PACKAGE_NAME-$APP_VERSION-setup.exe"
else
    echo "NSIS not found. Creating ZIP archive instead..."
    cd installer
    zip -r ../$PACKAGE_NAME-$APP_VERSION-windows.zip .
    cd ..
    echo "✓ Windows ZIP created: $PACKAGE_NAME-$APP_VERSION-windows.zip"
fi
EOF
    chmod +x "$WINDOWS_DIR/build.sh"
    
    echo -e "${YELLOW}Windows installer files prepared${NC}"
    echo -e "  ${CYAN}Location:${NC} $WINDOWS_DIR/"
    echo -e "  ${CYAN}Files:${NC}"
    echo -e "    - installer.nsi (NSIS script)"
    echo -e "    - install.ps1 (PowerShell installer)"
    echo -e "    - build.sh (Build script)"
    echo ""
    echo -e "${YELLOW}To build the EXE on Linux:${NC}"
    echo -e "  1. Install NSIS: ${GREEN}sudo apt install nsis${NC}"
    echo -e "  2. Run: ${GREEN}cd $WINDOWS_DIR && ./build.sh${NC}"
    echo ""
}

build_macos() {
    echo -e "${BLUE}══════════════════════════════════════${NC}"
    echo -e "${BLUE}  BUILDING MACOS DMG INSTALLER         ${NC}"
    echo -e "${BLUE}══════════════════════════════════════${NC}"
    
    MACOS_DIR="$BUILD_DIR/macos"
    APP_DIR="$MACOS_DIR/SUPER GOAT ROYALTIES APP.app"
    CONTENTS_DIR="$APP_DIR/Contents"
    MACOS_DIR_APP="$CONTENTS_DIR/MacOS"
    RESOURCES_DIR="$CONTENTS_DIR/Resources"
    
    mkdir -p "$MACOS_DIR_APP"
    mkdir -p "$RESOURCES_DIR"
    
    # Create Info.plist
    cat > "$CONTENTS_DIR/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>SUPER GOAT ROYALTIES APP</string>
    <key>CFBundleDisplayName</key>
    <string>SUPER GOAT ROYALTIES APP</string>
    <key>CFBundleIdentifier</key>
    <string>com.goatroyalty.app</string>
    <key>CFBundleVersion</key>
    <string>$APP_VERSION</string>
    <key>CFBundleShortVersionString</key>
    <string>$APP_VERSION</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleExecutable</key>
    <string>start</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.13</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>NSHumanReadableCopyright</key>
    <string>Copyright © 2025 GOAT Royalty. All rights reserved.</string>
</dict>
</plist>
EOF
    
    # Copy application files
    cp -r "$BUILD_DIR/temp/"* "$MACOS_DIR_APP/"
    
    # Create startup script
    cat > "$MACOS_DIR_APP/start" << 'EOF'
#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Check for Node.js
if ! command -v node &> /dev/null; then
    osascript -e 'display dialog "Node.js is required. Please install Node.js from https://nodejs.org/" buttons {"OK"} default button "OK"'
    exit 1
fi

# Start the application
osascript -e 'display notification "Starting SUPER GOAT ROYALTIES APP..." with title "GOAT Royalty"'
node server.js
EOF
    chmod +x "$MACOS_DIR_APP/start"
    
    # Create DMG build script
    cat > "$MACOS_DIR/create-dmg.sh" << 'EOF'
#!/bin/bash
# Create DMG installer for macOS
# Run this on macOS for best results

APP_NAME="SUPER GOAT ROYALTIES APP"
VERSION="1.0.0"
DMG_NAME="super-goat-royalties-$VERSION-macos.dmg"

echo "Creating DMG for $APP_NAME..."

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "WARNING: Not running on macOS"
    echo "Creating ZIP archive instead..."
    zip -r "super-goat-royalties-$VERSION-macos.zip" "SUPER GOAT ROYALTIES APP.app"
    echo "✓ Created: super-goat-royalties-$VERSION-macos.zip"
    exit 0
fi

# Create DMG
hdiutil create -volname "$APP_NAME" -srcfolder "SUPER GOAT ROYALTIES APP.app" -ov -format UDZO "$DMG_NAME"

echo "✓ DMG created: $DMG_NAME"

# Optional: Sign the DMG (requires Apple Developer account)
# codesign --sign "Developer ID Application: Your Name" "$DMG_NAME"

# Optional: Notarize the DMG (requires Apple Developer account)
# xcrun notarytool submit "$DMG_NAME" --apple-id "your@email.com" --team-id "TEAM_ID" --password "app-specific-password" --wait
EOF
    chmod +x "$MACOS_DIR/create-dmg.sh"
    
    # Create ZIP as fallback
    cd "$MACOS_DIR"
    zip -r -q "$PACKAGE_NAME-$APP_VERSION-macos.zip" "SUPER GOAT ROYALTIES APP.app"
    cd - > /dev/null
    
    echo -e "${GREEN}✓ macOS app bundle created${NC}"
    echo -e "  ${CYAN}Location:${NC} $MACOS_DIR/"
    echo -e "  ${CYAN}Files:${NC}"
    echo -e "    - SUPER GOAT ROYALTIES APP.app/ (App bundle)"
    echo -e "    - $PACKAGE_NAME-$APP_VERSION-macos.zip (ZIP archive)"
    echo -e "    - create-dmg.sh (DMG creation script)"
    echo ""
    echo -e "${YELLOW}To create DMG on macOS:${NC}"
    echo -e "  1. Copy files to a Mac"
    echo -e "  2. Run: ${GREEN}cd $MACOS_DIR && ./create-dmg.sh${NC}"
    echo ""
}

build_linux() {
    echo -e "${BLUE}══════════════════════════════════════${NC}"
    echo -e "${BLUE}  BUILDING LINUX PACKAGES             ${NC}"
    echo -e "${BLUE}══════════════════════════════════════${NC}"
    
    LINUX_DIR="$BUILD_DIR/linux"
    mkdir -p "$LINUX_DIR"
    
    # Create .deb package
    echo -e "${CYAN}Creating .deb package...${NC}"
    
    DEB_DIR="$LINUX_DIR/deb"
    DEB_PACKAGE="$DEB_DIR/${PACKAGE_NAME}_$APP_VERSION"
    
    mkdir -p "$DEB_PACKAGE/DEBIAN"
    mkdir -p "$DEB_PACKAGE/opt/goat-royalty"
    mkdir -p "$DEB_PACKAGE/usr/share/applications"
    mkdir -p "$DEB_PACKAGE/usr/share/icons/hicolor/256x256/apps"
    mkdir -p "$DEB_PACKAGE/usr/bin"
    
    # Create control file
    cat > "$DEB_PACKAGE/DEBIAN/control" << EOF
Package: super-goat-royalties
Version: $APP_VERSION
Section: devel
Priority: optional
Architecture: amd64
Depends: nodejs (>= 14.0.0), npm
Maintainer: GOAT Royalty <support@goatroyalty.com>
Description: SUPER GOAT ROYALTIES APP - Music Royalty Management Platform
 A comprehensive music royalty management platform with AI integration,
 featuring 242 API endpoints, 6 AI engines, voice commands, and real-time
 dashboard with self-healing capabilities.
Homepage: https://github.com/DJSPEEDYGA/nextjs-commerce
EOF
    
    # Create postinst script
    cat > "$DEB_PACKAGE/DEBIAN/postinst" << 'EOF'
#!/bin/bash
ln -sf /opt/goat-royalty/start.sh /usr/bin/super-goat-royalties
chmod +x /opt/goat-royalty/start.sh
chmod +x /opt/goat-royalty/server.js
echo "SUPER GOAT ROYALTIES APP installed successfully!"
echo "Run 'super-goat-royalties' to start the application."
EOF
    chmod +x "$DEB_PACKAGE/DEBIAN/postinst"
    
    # Copy application files
    cp -r "$BUILD_DIR/temp/"* "$DEB_PACKAGE/opt/goat-royalty/"
    
    # Create start script
    cat > "$DEB_PACKAGE/opt/goat-royalty/start.sh" << 'EOF'
#!/bin/bash
cd /opt/goat-royalty
echo "Starting SUPER GOAT ROYALTIES APP..."
echo "Access your app at: http://localhost:3000"
echo "Press Ctrl+C to stop the server"
node server.js
EOF
    chmod +x "$DEB_PACKAGE/opt/goat-royalty/start.sh"
    
    # Create desktop entry
    cat > "$DEB_PACKAGE/usr/share/applications/super-goat-royalties.desktop" << EOF
[Desktop Entry]
Name=SUPER GOAT ROYALTIES APP
Comment=Music Royalty Management Platform
Exec=/usr/bin/super-goat-royalties
Icon=super-goat-royalties
Terminal=true
Type=Application
Categories=Development;AudioVideo;
StartupNotify=true
EOF
    
    # Build .deb
    dpkg-deb --build "$DEB_PACKAGE" "$LINUX_DIR/${PACKAGE_NAME}_$APP_VERSION_amd64.deb" 2>/dev/null || {
        echo -e "${YELLOW}Note: dpkg-deb not available. Creating .tar.gz instead.${NC}"
        tar -czf "$LINUX_DIR/${PACKAGE_NAME}_$APP_VERSION_linux.tar.gz" -C "$DEB_PACKAGE" .
    }
    
    # Create AppImage structure
    echo -e "${CYAN}Creating AppImage structure...${NC}"
    
    APPIMAGE_DIR="$LINUX_DIR/appimage"
    mkdir -p "$APPIMAGE_DIR/super-goat-royalties.AppDir/usr"
    
    # Copy files
    cp -r "$DEB_PACKAGE/opt" "$APPIMAGE_DIR/super-goat-royalties.AppDir/usr/"
    cp -r "$DEB_PACKAGE/usr/share" "$APPIMAGE_DIR/super-goat-royalties.AppDir/usr/"
    
    # Create AppRun
    cat > "$APPIMAGE_DIR/super-goat-royalties.AppDir/AppRun" << 'EOF'
#!/bin/bash
SELF=$(readlink -f "$0")
HERE=${SELF%/*}
exec "$HERE/usr/opt/goat-royalty/start.sh"
EOF
    chmod +x "$APPIMAGE_DIR/super-goat-royalties.AppDir/AppRun"
    
    # Create desktop file for AppImage
    cp "$DEB_PACKAGE/usr/share/applications/super-goat-royalties.desktop" \
       "$APPIMAGE_DIR/super-goat-royalties.AppDir/super-goat-royalties.desktop"
    
    echo -e "${GREEN}✓ Linux packages created${NC}"
    echo -e "  ${CYAN}Location:${NC} $LINUX_DIR/"
    echo -e "  ${CYAN}Files:${NC}"
    ls -la "$LINUX_DIR/" 2>/dev/null | grep -E "\.(deb|tar\.gz)$" || echo "    - Package structure ready"
    echo ""
}

# Execute builds
echo -e "${PURPLE}Starting build process...${NC}"
echo ""

if [ "$BUILD_PORTABLE" = true ]; then
    build_portable
fi

if [ "$BUILD_WINDOWS" = true ]; then
    build_windows
fi

if [ "$BUILD_MACOS" = true ]; then
    build_macos
fi

if [ "$BUILD_LINUX" = true ]; then
    build_linux
fi

# Summary
echo -e "${PURPLE}======================================${NC}"
echo -e "${PURPLE}   BUILD COMPLETE!                   ${NC}"
echo -e "${PURPLE}======================================${NC}"
echo ""
echo -e "${GREEN}All requested installers have been prepared!${NC}"
echo ""
echo -e "${CYAN}Build output location: ${YELLOW}$BUILD_DIR/${NC}"
echo ""
echo -e "${CYAN}Directory structure:${NC}"
tree "$BUILD_DIR" -L 2 2>/dev/null || find "$BUILD_DIR" -maxdepth 2 -type d
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Review the generated files in ${GREEN}$BUILD_DIR/${NC}"
echo -e "  2. Run platform-specific build scripts as needed"
echo -e "  3. Test installers on target platforms"
echo -e "  4. Distribute via your preferred channels"
echo ""
echo -e "${CYAN}Distribution recommendations:${NC}"
echo -e "  • GitHub Releases: Free, public distribution"
echo -e "  • AWS S3: Fast downloads, pay-per-use"
echo -e "  • DigitalOcean Spaces: \$5/month, 250GB storage"
echo -e "  • Your own server: Direct control"
echo ""
echo -e "${GREEN}Thank you for using SUPER GOAT ROYALTIES APP Builder!${NC}"
