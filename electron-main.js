/**
 * SUPER GOAT ROYALTIES - Electron Main Process
 * Desktop application shell with system tray, menus, and secure IPC
 *
 * This file is ONLY used by the Electron desktop build.
 * Vercel / web deployments run server.js directly and never load this file.
 * Set process.env.ELECTRON_BUILD=true to confirm Electron context at runtime.
 */

const { app, BrowserWindow, Menu, Tray, ipcMain, shell, dialog } = require('electron');
const path = require('path');

// Mark the process as an Electron build so server.js and other modules can
// adapt their behaviour when running inside the desktop app.
process.env.ELECTRON_BUILD = 'true';

let mainWindow;
let tray;
// serverProcess reserved for future use (e.g. spawning a child process)
let serverProcess; // eslint-disable-line no-unused-vars
const SERVER_PORT = process.env.PORT || 3000;

// Resolve the correct icon path depending on platform and available files.
// Falls back gracefully so missing build assets never crash the app.
function resolveIcon() {
    const candidates = [
        path.join(__dirname, 'build', 'icon.ico'),   // Windows preferred
        path.join(__dirname, 'build', 'icon.icns'),  // macOS preferred
        path.join(__dirname, 'build', 'icon.png'),   // Linux / fallback
        path.join(__dirname, 'favicon.ico')          // last resort
    ];
    const fs = require('fs');
    for (const candidate of candidates) {
        try {
            if (fs.existsSync(candidate)) return candidate;
        } catch { /* ignore */ }
    }
    return undefined; // Electron will use its own default icon
}

// ==================== SINGLE INSTANCE LOCK ====================
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        // Focus the main window if a second instance is attempted
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

// ==================== WINDOW CREATION ====================
function createWindow() {
    const iconPath = resolveIcon();

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        ...(iconPath && { icon: iconPath }),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            preload: path.join(__dirname, 'preload.js')
        },
        backgroundColor: '#0a0a1a',
        title: 'SUPER GOAT ROYALTIES - AI-Powered Creator Platform',
        show: false // Wait for ready-to-show
    });

    // Show when ready to avoid visual flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    // Start the Express server, then load the app
    startServer().then(() => {
        mainWindow.loadURL(`http://localhost:${SERVER_PORT}`);
    }).catch(err => {
        console.error('[Electron] Failed to start embedded server:', err.message);
        mainWindow.loadURL(
            `data:text/html,<html><body style="background:#0a0a1a;color:#fff;font-family:sans-serif;padding:2rem">` +
            `<h1>&#x26A0; Server failed to start</h1><p>${err.message}</p>` +
            `<p>Check that all dependencies are installed (<code>npm install</code>) and try again.</p>` +
            `</body></html>`
        );
    });

    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    // Handle external links - open in default browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Minimize to tray instead of closing (Windows/Linux)
    mainWindow.on('close', (event) => {
        if (process.platform !== 'darwin' && tray && !app.isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });
}

// ==================== SERVER MANAGEMENT ====================
function startServer() {
    return new Promise((resolve, reject) => {
        try {
            // Require the Express server in-process so Electron and the web
            // server share the same Node.js runtime (no extra child processes).
            // This keeps the build simple and avoids port-conflict edge-cases.
            require('./server');
            // Give the server a moment to bind to the port before we load the URL.
            setTimeout(() => {
                console.log(`[Electron] ✅ Express server started on port ${SERVER_PORT}`);
                resolve();
            }, 2000);
        } catch (err) {
            reject(err);
        }
    });
}

// ==================== SYSTEM TRAY ====================
function createTray() {
    const iconPath = resolveIcon();

    if (!iconPath) {
        console.warn('[Electron] No tray icon found, skipping system tray');
        return;
    }

    try {
        tray = new Tray(iconPath);
    } catch (e) {
        console.warn('[Electron] Failed to create system tray:', e.message);
        return;
    }

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show GOAT Royalties',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                }
            }
        },
        { type: 'separator' },
        {
            label: 'Dashboard',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.webContents.executeJavaScript("showPage('dashboard')");
                }
            }
        },
        {
            label: 'AI Chat',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.webContents.executeJavaScript("showPage('ai-chat')");
                }
            }
        },
        { type: 'separator' },
        {
            label: 'Open in Browser',
            click: () => {
                shell.openExternal(`http://localhost:${SERVER_PORT}`);
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                app.isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('SUPER GOAT Royalties v3.0');
    tray.setContextMenu(contextMenu);

    tray.on('double-click', () => {
        if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
        }
    });
}

// ==================== APPLICATION MENU ====================
function createMenu() {
    const isMac = process.platform === 'darwin';

    const template = [
        // macOS app menu
        ...(isMac ? [{
            label: app.getName(),
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        {
            label: 'File',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { type: 'separator' },
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectAll' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
                { type: 'separator' },
                { role: 'toggleDevTools' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front' }
                ] : [
                    { role: 'close' }
                ])
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About GOAT Royalties',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About SUPER GOAT Royalties',
                            message: 'SUPER GOAT Royalties v3.0',
                            detail: 'AI-Powered Creator Platform\n\nPowered by NVIDIA NIM, LangChain, and RAG\nWith Autonomous AI Agents\n\n© 2024 DJSPEEDYGA',
                            buttons: ['OK']
                        });
                    }
                },
                { type: 'separator' },
                {
                    label: 'Open in Browser',
                    click: () => {
                        shell.openExternal(`http://localhost:${SERVER_PORT}`);
                    }
                },
                {
                    label: 'GitHub Repository',
                    click: () => {
                        shell.openExternal('https://github.com/DJSPEEDYGA/nextjs-commerce');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// ==================== IPC HANDLERS ====================
ipcMain.handle('get-app-info', () => {
    return {
        version: app.getVersion(),
        name: app.getName(),
        platform: process.platform,
        electron: process.versions.electron,
        node: process.versions.node
    };
});

ipcMain.on('get-app-version', (event) => {
    event.reply('app-version', app.getVersion());
});

ipcMain.on('minimize-window', () => {
    if (mainWindow) mainWindow.minimize();
});

ipcMain.on('maximize-window', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    }
});

ipcMain.on('close-window', () => {
    if (mainWindow) mainWindow.close();
});

// ==================== APP LIFECYCLE ====================
app.on('ready', () => {
    createWindow();
    createMenu();
    createTray();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    } else {
        mainWindow.show();
    }
});

app.on('before-quit', () => {
    app.isQuitting = true;
});

module.exports = { createWindow };