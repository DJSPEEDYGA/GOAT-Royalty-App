# Code Signing Guide for SUPER GOAT ROYALTIES APP

This guide covers code signing for all platforms to ensure trust and avoid security warnings for your users.

## Why Code Sign?

- **Windows**: Prevents "Unknown Publisher" warnings and SmartScreen blocks
- **macOS**: Required for Gatekeeper; prevents "App is damaged" errors
- **Linux**: Optional but recommended for distribution via repositories

---

## Windows Code Signing

### Prerequisites

1. **Code Signing Certificate** from a trusted CA:
   - [Sectigo](https://www.sectigo.com/) (~$200-400/year)
   - [DigiCert](https://www.digicert.com/) (~$400-600/year)
   - [GlobalSign](https://www.globalsign.com/) (~$300-500/year)
   - [SSL.com](https://www.ssl.com/) (~$150-300/year)

2. **Types of Certificates**:
   - **OV (Organization Validation)**: Standard, good for most uses
   - **EV (Extended Validation)**: Required for kernel drivers, faster reputation building

### Signing Process

#### Using SignTool (Windows SDK)

```powershell
# Install Windows SDK
# Download from: https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/

# Sign the executable
signtool sign /fd SHA256 /td SHA256 /tr http://timestamp.digicert.com /f "certificate.pfx" /p "password" "super-goat-royalties-setup.exe"

# Verify signature
signtool verify /pa "super-goat-royalties-setup.exe"
```

#### Using Azure SignTool (Cross-Platform)

```bash
# Install Azure SignTool
dotnet tool install --global AzureSignTool

# Sign with Azure Key Vault
azuresigntool sign \
  --azure-key-vault-url "https://your-vault.vault.azure.net/" \
  --azure-key-vault-client-id "client-id" \
  --azure-key-vault-client-secret "secret" \
  --azure-key-vault-certificate "certificate-name" \
  --timestamp-url "http://timestamp.digicert.com" \
  "super-goat-royalties-setup.exe"
```

#### Signing with NSIS

Add to your NSIS script:
```nsis
!finalize 'signtool sign /fd SHA256 /td SHA256 /tr http://timestamp.digicert.com /f "cert.pfx" /p "password" "%1"'
```

### Building Reputation

- Windows SmartScreen initially blocks new certificates
- Build reputation by having users install and click "Run anyway"
- EV certificates get instant reputation; OV certificates need downloads

---

## macOS Code Signing

### Prerequisites

1. **Apple Developer Account** ($99/year)
   - Enroll at: https://developer.apple.com/programs/

2. **Developer ID Application Certificate**
   - Create in Xcode → Preferences → Accounts
   - Or via https://developer.apple.com/account

### Signing Process

#### Sign the App Bundle

```bash
# Sign the app
codesign --deep --force --verify --verbose \
  --sign "Developer ID Application: Your Name (TEAM_ID)" \
  --options runtime \
  "SUPER GOAT ROYALTIES APP.app"

# Verify signature
codesign --verify --deep --strict --verbose=2 "SUPER GOAT ROYALTIES APP.app"
spctl --assess --verbose --type execute "SUPER GOAT ROYALTIES APP.app"
```

#### Create Signed DMG

```bash
# Using create-dmg
create-dmg \
  --volname "SUPER GOAT ROYALTIES APP" \
  --volicon "icon.icns" \
  --background "background.png" \
  --window-pos 200 120 \
  --window-size 660 400 \
  --icon-size 100 \
  --icon "SUPER GOAT ROYALTIES APP.app" 180 170 \
  --hide-extension "SUPER GOAT ROYALTIES APP.app" \
  --app-drop-link 480 170 \
  --codesign "Developer ID Application: Your Name (TEAM_ID)" \
  "super-goat-royalties-1.0.0-macos.dmg" \
  "SUPER GOAT ROYALTIES APP.app"
```

### Notarization (Required for Gatekeeper)

```bash
# Submit for notarization
xcrun notarytool submit "super-goat-royalties-1.0.0-macos.dmg" \
  --apple-id "your@email.com" \
  --team-id "TEAM_ID" \
  --password "app-specific-password" \
  --wait

# Check notarization history
xcrun notarytool history \
  --apple-id "your@email.com" \
  --team-id "TEAM_ID" \
  --password "app-specific-password"

# Staple the notarization ticket
xcrun stapler staple "super-goat-royalties-1.0.0-macos.dmg"

# Verify stapling
spctl --assess --verbose --type open --context context:primary-signature "super-goat-royalties-1.0.0-macos.dmg"
```

---

## Linux Code Signing

### GPG Signing

```bash
# Generate a GPG key (if you don't have one)
gpg --full-generate-key

# List your keys
gpg --list-keys

# Export your public key
gpg --armor --export your@email.com > public-key.asc

# Sign a package
gpg --armor --detach-sign super-goat-royalties_1.0.0_amd64.deb

# Verify signature
gpg --verify super-goat-royalties_1.0.0_amd64.deb.asc super-goat-royalties_1.0.0_amd64.deb
```

### APT Repository Signing

```bash
# Generate signing key
gpg --default-new-key-algo rsa4096 --gen-key

# Export public key for users
gpg --armor --export your@email.com > repo-key.asc

# Sign your Packages file
gpg --armor --detach-sign dists/stable/main/binary-amd64/Packages

# Create Release file
apt-ftparchive release . > Release
gpg --clearsign -o InRelease Release
```

---

## Automating Code Signing

### GitHub Actions Secrets

Add these secrets to your repository:
- `WINDOWS_CERT_BASE64` - Base64 encoded PFX certificate
- `WINDOWS_CERT_PASSWORD` - Certificate password
- `MACOS_CERT_BASE64` - Base64 encoded .p12 certificate
- `MACOS_CERT_PASSWORD` - Certificate password
- `APPLE_ID` - Your Apple ID email
- `APPLE_TEAM_ID` - Your Apple Developer Team ID
- `APPLE_APP_SPECIFIC_PASSWORD` - App-specific password for notarytool

### Example GitHub Actions Workflow

```yaml
name: Build and Sign

jobs:
  sign-windows:
    runs-on: windows-latest
    steps:
      - name: Decode certificate
        run: |
          $bytes = [Convert]::FromBase64String("${{ secrets.WINDOWS_CERT_BASE64 }}")
          [IO.File]::WriteAllBytes("cert.pfx", $bytes)
      
      - name: Sign executable
        run: |
          signtool sign /fd SHA256 /td SHA256 /tr http://timestamp.digicert.com /f cert.pfx /p "${{ secrets.WINDOWS_CERT_PASSWORD }}" dist/windows/super-goat-royalties-setup.exe
      
      - name: Cleanup
        run: Remove-Item cert.pfx

  sign-macos:
    runs-on: macos-latest
    steps:
      - name: Decode certificate
        run: |
          echo "${{ secrets.MACOS_CERT_BASE64 }}" | base64 --decode > cert.p12
      
      - name: Import certificate
        run: |
          security create-keychain -p actions temp.keychain
          security import cert.p12 -k temp.keychain -P "${{ secrets.MACOS_CERT_PASSWORD }}" -T /usr/bin/codesign
          security set-key-partition-list -S apple-tool:,apple: -s -k actions temp.keychain
      
      - name: Sign app
        run: |
          codesign --deep --force --verify --verbose \
            --sign "Developer ID Application: Your Name (${{ secrets.APPLE_TEAM_ID }})" \
            --options runtime \
            "dist/macos/SUPER GOAT ROYALTIES APP.app"
      
      - name: Notarize
        run: |
          xcrun notarytool submit dist/macos/super-goat-royalties-1.0.0-macos.dmg \
            --apple-id "${{ secrets.APPLE_ID }}" \
            --team-id "${{ secrets.APPLE_TEAM_ID }}" \
            --password "${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}" \
            --wait
      
      - name: Staple
        run: |
          xcrun stapler staple dist/macos/super-goat-royalties-1.0.0-macos.dmg
      
      - name: Cleanup
        run: |
          rm -f cert.p12
          security delete-keychain temp.keychain
```

---

## Security Best Practices

1. **Never commit certificates to the repository**
2. **Use hardware tokens (YubiKey) for certificate storage**
3. **Rotate certificates before expiration**
4. **Use separate certificates for development and production**
5. **Keep certificate passwords in secure vaults (1Password, LastPass, etc.)**
6. **Enable 2FA on all certificate authority accounts**
7. **Maintain an audit log of all signing activities**

---

## Troubleshooting

### Windows: "Windows protected your PC"
- Your certificate needs more reputation
- Users should click "More info" → "Run anyway"
- Consider EV certificate for instant reputation

### macOS: "App is damaged and can't be opened"
- Run: `xattr -cr "SUPER GOAT ROYALTIES APP.app"`
- This removes quarantine attribute
- Proper solution: Sign and notarize correctly

### macOS: "Unidentified developer"
- App is not code signed
- Sign with Developer ID certificate
- Have users right-click → Open to bypass

### Linux: GPG signature verification failed
- Import the public key: `gpg --import public-key.asc`
- Verify trust: `gpg --edit-key your@email.com` → `trust` → `4`

---

## Cost Summary

| Platform | Tool/Certificate | Annual Cost |
|----------|-----------------|-------------|
| Windows | OV Certificate | $150-400 |
| Windows | EV Certificate | $400-700 |
| macOS | Developer Account | $99 |
| Linux | GPG | Free |
| **Total** | | **$250-500/year** |

---

## Resources

- [Microsoft Code Signing](https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools)
- [Apple Code Signing Guide](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/)
- [Notarizing macOS Software](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [GPG Manual](https://www.gnupg.org/documentation/manuals/gnupg/)
