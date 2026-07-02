const { app, BrowserWindow, shell, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const express = require('express');
const http = require('http');
const os = require('os');

let mainWindow;
let server;
const PORT = 3942;
const APP_NAME = 'Ms Money Penny Store';

function startExpressServer() {
  const expressApp = express();
  const staticPath = path.join(__dirname, 'static');
  
  expressApp.use(express.static(staticPath));

  // API endpoint — system info for the app
  expressApp.get('/api/system-info', (req, res) => {
    res.json({
      platform: process.platform,
      arch: process.arch,
      hostname: os.hostname(),
      cpus: os.cpus().length,
      totalMemory: (os.totalmem() / 1073741824).toFixed(1) + ' GB',
      freeMemory: (os.freemem() / 1073741824).toFixed(1) + ' GB',
      nodeVersion: process.version,
      electronVersion: process.versions.electron,
      appVersion: app.getVersion(),
    });
  });

  // Serve index.html for all unmatched routes (SPA fallback)
  expressApp.get('*', (req, res) => {
    const filePath = path.join(staticPath, req.path);
    const fs = require('fs');
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.sendFile(filePath);
    } else {
      res.sendFile(path.join(staticPath, 'index.html'));
    }
  });

  server = http.createServer(expressApp);
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`⚡ ${APP_NAME} server running on http://127.0.0.1:${PORT}`);
  });
}

function createAppMenu() {
  const template = [
    {
      label: APP_NAME,
      submenu: [
        { label: `About ${APP_NAME}`, role: 'about' },
        { type: 'separator' },
        {
          label: 'System Info',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'System Info',
              message: `${APP_NAME}\nVersion: ${app.getVersion()}\nElectron: ${process.versions.electron}\nNode: ${process.version}\nPlatform: ${process.platform} ${process.arch}\nMemory: ${(os.totalmem() / 1073741824).toFixed(1)} GB`,
              buttons: ['OK']
            });
          }
        },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
      ]
    },
    {
      label: '🛒 Store',
      submenu: [
        { label: '🏠 Home — Store', click: () => mainWindow.loadURL(`http://127.0.0.1:${PORT}/`) },
        { type: 'separator' },
        { label: '🧠 AI Models Hub', click: () => mainWindow.loadURL(`http://127.0.0.1:${PORT}/models.html`) },
        { label: '🛠️ AI Tools & Runtimes', click: () => mainWindow.loadURL(`http://127.0.0.1:${PORT}/tools.html`) },
        { label: '📥 Download Center', click: () => mainWindow.loadURL(`http://127.0.0.1:${PORT}/downloads.html`) },
      ]
    },
    {
      label: '🧠 AI Stack',
      submenu: [
        { label: '⚡ Lightning AI Models', click: () => shell.openExternal('https://lightning.ai') },
        { label: '🤗 HuggingFace Models', click: () => shell.openExternal('https://huggingface.co/models?pipeline_tag=text-to-image') },
        { type: 'separator' },
        { label: '🔥 FLUX.1-dev', click: () => shell.openExternal('https://huggingface.co/black-forest-labs/FLUX.1-dev') },
        { label: '🎨 Stable Diffusion XL', click: () => shell.openExternal('https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0') },
        { label: '🧠 NVIDIA Nemotron', click: () => shell.openExternal('https://huggingface.co/nvidia') },
        { type: 'separator' },
        { label: '🦙 Ollama — Local LLMs', click: () => shell.openExternal('https://ollama.com') },
        { label: '🎯 ComfyUI', click: () => shell.openExternal('https://github.com/comfyanonymous/ComfyUI') },
        { label: '🖌️ Auto1111 WebUI', click: () => shell.openExternal('https://github.com/AUTOMATIC1111/stable-diffusion-webui') },
        { label: '🖥️ LM Studio', click: () => shell.openExternal('https://lmstudio.ai') },
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.reload() },
        { label: 'Force Reload', accelerator: 'CmdOrCtrl+Shift+R', click: () => mainWindow.webContents.reloadIgnoringCache() },
        { type: 'separator' },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+=', click: () => mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() + 0.5) },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', click: () => mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() - 0.5) },
        { label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0', click: () => mainWindow.webContents.setZoomLevel(0) },
        { type: 'separator' },
        { label: 'Toggle Full Screen', accelerator: 'F11', click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()) },
        { label: 'Developer Tools', accelerator: 'F12', click: () => mainWindow.webContents.toggleDevTools() },
      ]
    },
    {
      label: 'Navigate',
      submenu: [
        { label: '← Back', accelerator: 'Alt+Left', click: () => mainWindow.webContents.goBack() },
        { label: '→ Forward', accelerator: 'Alt+Right', click: () => mainWindow.webContents.goForward() },
        { type: 'separator' },
        { label: '🛒 Store Home', accelerator: 'CmdOrCtrl+1', click: () => mainWindow.loadURL(`http://127.0.0.1:${PORT}/`) },
        { label: '🧠 AI Models', accelerator: 'CmdOrCtrl+2', click: () => mainWindow.loadURL(`http://127.0.0.1:${PORT}/models.html`) },
        { label: '🛠️ Tools', accelerator: 'CmdOrCtrl+3', click: () => mainWindow.loadURL(`http://127.0.0.1:${PORT}/tools.html`) },
        { label: '📥 Downloads', accelerator: 'CmdOrCtrl+4', click: () => mainWindow.loadURL(`http://127.0.0.1:${PORT}/downloads.html`) },
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: '📖 Documentation', click: () => shell.openExternal('https://github.com/DJSPEEDYGA/nextjs-commerce') },
        { label: '🐛 Report Issue', click: () => shell.openExternal('https://github.com/DJSPEEDYGA/nextjs-commerce/issues') },
        { label: '⭐ Star on GitHub', click: () => shell.openExternal('https://github.com/DJSPEEDYGA/nextjs-commerce') },
        { type: 'separator' },
        { label: '🌐 Life Imitates Art Inc.', click: () => shell.openExternal('https://lifeimitatesart.org') },
        { label: '⚡ Lightning AI', click: () => shell.openExternal('https://lightning.ai') },
        { label: '🤗 HuggingFace', click: () => shell.openExternal('https://huggingface.co') },
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: APP_NAME,
    icon: path.join(__dirname, 'build', process.platform === 'win32' ? 'icon.ico' : 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
    backgroundColor: '#0a0a0a',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://127.0.0.1') || url.startsWith('http://localhost')) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Handle navigation to external URLs
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(`http://127.0.0.1:${PORT}`)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log(`🚀 ${APP_NAME} ready!`);
  });

  // Wait for server then load
  setTimeout(() => {
    mainWindow.loadURL(`http://127.0.0.1:${PORT}`);
  }, 500);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startExpressServer();
  createAppMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (server) server.close();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (server) server.close();
});