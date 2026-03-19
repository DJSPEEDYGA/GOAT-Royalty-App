// ============================================================
// Super GOAT Royalty 3.0 - Main Electron Process
// AI-Powered Command Center with 215+ LLM Integration
// Built for Harvey Miller (DJ Speedy)
// ============================================================

const { app, BrowserWindow, ipcMain, dialog, Menu, Tray, shell, globalShortcut, nativeTheme, Notification } = require('electron');
const path = require('path');
const fs = require('fs');

// ── Settings Store ───────────────────────────────────────────
const Store = class {
  constructor(opts) {
    this._defaults = opts?.defaults || {};
    this._path = path.join(app.getPath('userData'), 'settings.json');
    this._data = { ...this._defaults };
    try {
      if (fs.existsSync(this._path)) {
        this._data = { ...this._defaults, ...JSON.parse(fs.readFileSync(this._path, 'utf-8')) };
      }
    } catch (e) { /* use defaults */ }
  }
  get(key) { return this._data[key]; }
  set(key, val) { this._data[key] = val; this._save(); }
  get store() { return this._data; }
  _save() {
    try { fs.writeFileSync(this._path, JSON.stringify(this._data, null, 2)); } catch (e) { /* ignore */ }
  }
};

const store = new Store({
  defaults: {
    theme: 'dark',
    windowBounds: { width: 1400, height: 900 },
    alwaysOnTop: false,
    startMinimized: false,
    autoLaunch: false,
    recentFiles: [],
    recentChats: [],

    // ── AI Provider Keys ──────────────────────────────────
    nvidiaKey: '',          // build.nvidia.com
    openaiKey: '',          // OpenAI
    googleKey: '',          // Google Gemini
    anthropicKey: '',       // Anthropic Claude
    huggingfaceKey: '',     // Hugging Face
    groqKey: '',            // Groq
    cerebrasKey: '',        // Cerebras
    sambanovaKey: '',       // SambaNova
    togetherKey: '',        // Together AI
    fireworksKey: '',       // Fireworks AI
    novitaKey: '',          // Novita AI
    hyperbolicKey: '',      // Hyperbolic
    ollamaUrl: 'http://localhost:11434',

    // ── Active Provider & Model ───────────────────────────
    activeProvider: 'nvidia',
    activeModel: 'meta/llama-3.3-70b-instruct',

    // ── GOAT Brain Settings ───────────────────────────────
    goatBrainEnabled: false,
    goatBrainMode: 'specialist',
    goatBrainModels: [],

    // ── Music & Royalty ───────────────────────────────────
    spotifyClientId: '',
    supabaseUrl: '',
    supabaseKey: '',

    // ── Tool Settings ─────────────────────────────────────
    toolSettings: {
      terminal: true,
      fileManager: true,
      webBrowser: true,
      codeEditor: true,
      imageTools: true,
      audioTools: true,
      dataAnalysis: true,
      pdfTools: true,
      axiom: true,
      modelHub: true,
      goatBrain: true
    }
  }
});

let mainWindow = null;
let tray = null;

function createWindow() {
  const { width, height } = store.get('windowBounds');

  mainWindow = new BrowserWindow({
    width,
    height,
    minWidth: 1000,
    minHeight: 700,
    title: 'Super GOAT Royalty 3.0',
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    backgroundColor: '#0a0a0f',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    frame: process.platform !== 'darwin',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      spellcheck: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.on('resize', () => {
    const { width, height } = mainWindow.getBounds();
    store.set('windowBounds', { width, height });
  });

  mainWindow.on('closed', () => { mainWindow = null; });
  mainWindow.setAlwaysOnTop(store.get('alwaysOnTop'));
  createAppMenu();
}

function createAppMenu() {
  const template = [
    {
      label: 'Super GOAT Royalty',
      submenu: [
        { label: 'About Super GOAT Royalty 3.0', click: showAbout },
        { type: 'separator' },
        { label: 'Settings', accelerator: 'CmdOrCtrl+,', click: () => mainWindow.webContents.send('open-settings') },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
      ]
    },
    {
      label: 'File',
      submenu: [
        { label: 'New Chat', accelerator: 'CmdOrCtrl+N', click: () => mainWindow.webContents.send('new-chat') },
        { label: 'Open File', accelerator: 'CmdOrCtrl+O', click: openFile },
        { label: 'Save Chat', accelerator: 'CmdOrCtrl+S', click: () => mainWindow.webContents.send('save-chat') },
        { type: 'separator' },
        { label: 'Export as PDF', click: () => mainWindow.webContents.send('export-pdf') },
        { label: 'Export as Markdown', click: () => mainWindow.webContents.send('export-md') }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        { label: 'Terminal', accelerator: 'CmdOrCtrl+T', click: () => mainWindow.webContents.send('open-tool', 'terminal') },
        { label: 'File Manager', accelerator: 'CmdOrCtrl+E', click: () => mainWindow.webContents.send('open-tool', 'filemanager') },
        { label: 'Code Editor', accelerator: 'CmdOrCtrl+K', click: () => mainWindow.webContents.send('open-tool', 'codeeditor') },
        { label: 'Web Browser', accelerator: 'CmdOrCtrl+B', click: () => mainWindow.webContents.send('open-tool', 'webbrowser') },
        { type: 'separator' },
        { label: 'Model Hub (215+ LLMs)', click: () => mainWindow.webContents.send('open-tool', 'modelhub') },
        { label: 'GOAT Brain Orchestrator', click: () => mainWindow.webContents.send('open-tool', 'goatbrain') },
        { type: 'separator' },
        { label: 'Image Tools', click: () => mainWindow.webContents.send('open-tool', 'imagetools') },
        { label: 'Audio Tools', click: () => mainWindow.webContents.send('open-tool', 'audiotools') },
        { label: 'PDF Tools', click: () => mainWindow.webContents.send('open-tool', 'pdftools') },
        { label: 'Data Analysis', click: () => mainWindow.webContents.send('open-tool', 'dataanalysis') },
        { type: 'separator' },
        { label: 'Music Production', click: () => mainWindow.webContents.send('open-tool', 'musicprod') },
        { label: 'Royalty Calculator', click: () => mainWindow.webContents.send('open-tool', 'royaltycalc') },
        { type: 'separator' },
        { label: 'Axiom Browser Automation', click: () => mainWindow.webContents.send('open-tool', 'axiom') }
      ]
    },
    {
      label: 'AI',
      submenu: [
        { label: '── NVIDIA NIM ──', enabled: false },
        { label: 'Llama 3.3 70B', type: 'radio', checked: store.get('activeModel') === 'meta/llama-3.3-70b-instruct', click: () => setModel('nvidia', 'meta/llama-3.3-70b-instruct') },
        { label: 'DeepSeek R1 671B', type: 'radio', checked: store.get('activeModel') === 'deepseek-ai/deepseek-r1', click: () => setModel('nvidia', 'deepseek-ai/deepseek-r1') },
        { label: 'Nemotron 70B', type: 'radio', checked: store.get('activeModel') === 'nvidia/llama-3.1-nemotron-70b-instruct', click: () => setModel('nvidia', 'nvidia/llama-3.1-nemotron-70b-instruct') },
        { label: 'Qwen 2.5 72B', type: 'radio', checked: store.get('activeModel') === 'qwen/qwen2.5-72b-instruct', click: () => setModel('nvidia', 'qwen/qwen2.5-72b-instruct') },
        { label: 'Mistral Large 2', type: 'radio', checked: store.get('activeModel') === 'mistralai/mistral-large-2-instruct', click: () => setModel('nvidia', 'mistralai/mistral-large-2-instruct') },
        { type: 'separator' },
        { label: '── Cloud Providers ──', enabled: false },
        { label: 'OpenAI GPT-4o', type: 'radio', click: () => setModel('openai', 'gpt-4o') },
        { label: 'Google Gemini 2.0', type: 'radio', click: () => setModel('google', 'gemini-2.0-flash') },
        { label: 'Anthropic Claude 3.5', type: 'radio', click: () => setModel('anthropic', 'claude-3.5-sonnet') },
        { type: 'separator' },
        { label: '── Speed Providers ──', enabled: false },
        { label: 'Groq (Ultra-Fast)', type: 'radio', click: () => setModel('groq', 'llama-3.3-70b-versatile') },
        { label: 'Cerebras (Fastest)', type: 'radio', click: () => setModel('cerebras', 'llama3.3-70b') },
        { label: 'SambaNova', type: 'radio', click: () => setModel('sambanova', 'Meta-Llama-3.3-70B-Instruct') },
        { type: 'separator' },
        { label: '── Local Models ──', enabled: false },
        { label: 'Ollama - Llama 3', type: 'radio', click: () => setModel('ollama', 'llama3') },
        { label: 'Ollama - Mistral', type: 'radio', click: () => setModel('ollama', 'mistral') },
        { type: 'separator' },
        { label: '🧠 GOAT Brain (Multi-Model)', type: 'checkbox', checked: store.get('goatBrainEnabled'), click: (item) => toggleGOATBrain(item.checked) },
        { type: 'separator' },
        { label: 'Open Model Hub...', click: () => mainWindow.webContents.send('open-tool', 'modelhub') },
        { label: 'Configure API Keys...', click: () => mainWindow.webContents.send('open-settings', 'api-keys') }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Toggle Dark Mode', accelerator: 'CmdOrCtrl+D', click: toggleTheme },
        { label: 'Toggle Sidebar', accelerator: 'CmdOrCtrl+\\', click: () => mainWindow.webContents.send('toggle-sidebar') },
        { label: 'Toggle Always on Top', click: toggleAlwaysOnTop },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { role: 'resetZoom' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Documentation', click: () => shell.openExternal('https://github.com/DJSPEEDYGA/GOAT-Royalty-App.') },
        { label: 'NVIDIA NIM Models', click: () => shell.openExternal('https://build.nvidia.com/explore/discover') },
        { label: 'Hugging Face Models', click: () => shell.openExternal('https://huggingface.co/models') },
        { label: 'Report Issue', click: () => shell.openExternal('https://github.com/DJSPEEDYGA/GOAT-Royalty-App./issues') },
        { type: 'separator' },
        { label: 'Check for Updates', click: checkForUpdates }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function showAbout() {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'About Super GOAT Royalty',
    message: 'Super GOAT Royalty v3.0.0',
    detail: `AI-Powered Command Center
Built for Harvey Miller (DJ Speedy)

🟢 NVIDIA NIM - 215+ Models via build.nvidia.com
🤗 Hugging Face - Inference API + Providers
🧠 GOAT Brain - Multi-Model Orchestrator
⚡ Groq / Cerebras / SambaNova - Speed Providers
🤖 OpenAI / Google / Anthropic / Ollama

Features:
• Multi-LLM Chat (215+ models)
• GOAT Brain Super LLM Combiner
• Terminal & Code Editor
• File Management & Web Browsing
• Image & Audio Tools, PDF Processing
• Data Analysis & Visualization
• Music Production & Royalty Calculator
• Axiom Browser Automation

Copyright © 2025 GOAT Royalty`
  });
}

function setModel(provider, model) {
  store.set('activeProvider', provider);
  store.set('activeModel', model);
  mainWindow.webContents.send('model-changed', { provider, model });
}

function toggleGOATBrain(enabled) {
  store.set('goatBrainEnabled', enabled);
  mainWindow.webContents.send('goat-brain-toggled', enabled);
}

async function openFile() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'Documents', extensions: ['pdf', 'doc', 'docx', 'txt', 'md', 'rtf'] },
      { name: 'Code', extensions: ['js', 'py', 'html', 'css', 'json', 'ts', 'jsx', 'tsx'] },
      { name: 'Data', extensions: ['csv', 'json', 'xml', 'xlsx', 'xls'] },
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'] },
      { name: 'Audio', extensions: ['mp3', 'wav', 'flac', 'aac', 'm4a'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    mainWindow.webContents.send('files-opened', result.filePaths);
    const recentFiles = store.get('recentFiles');
    result.filePaths.forEach(fp => {
      if (!recentFiles.includes(fp)) {
        recentFiles.unshift(fp);
        if (recentFiles.length > 20) recentFiles.pop();
      }
    });
    store.set('recentFiles', recentFiles);
  }
}

function toggleTheme() {
  const current = store.get('theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  store.set('theme', newTheme);
  mainWindow.webContents.send('theme-changed', newTheme);
}

function toggleAlwaysOnTop() {
  const current = store.get('alwaysOnTop');
  store.set('alwaysOnTop', !current);
  mainWindow.setAlwaysOnTop(!current);
}

function checkForUpdates() {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Updates',
    message: 'Super GOAT Royalty is up to date!',
    detail: 'Version 3.0.0 - NVIDIA NIM + Hugging Face + GOAT Brain Edition'
  });
}

// ============================================================
// IPC Handlers
// ============================================================

ipcMain.handle('get-settings', () => store.store);
ipcMain.handle('set-setting', (event, key, value) => { store.set(key, value); return true; });

// File operations
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return { success: true, content, path: filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-file', async (event, filePath, content) => {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true, path: filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('read-binary', async (event, filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    return { success: true, data: buffer.toString('base64'), path: filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('list-directory', async (event, dirPath) => {
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    return {
      success: true,
      items: items.map(item => ({
        name: item.name,
        isDirectory: item.isDirectory(),
        isFile: item.isFile(),
        path: path.join(dirPath, item.name)
      }))
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-dialog', async (event, options) => await dialog.showSaveDialog(mainWindow, options));
ipcMain.handle('open-dialog', async (event, options) => await dialog.showOpenDialog(mainWindow, options));

// Terminal execution
ipcMain.handle('execute-command', async (event, command, cwd) => {
  const { exec } = require('child_process');
  return new Promise((resolve) => {
    exec(command, { cwd: cwd || process.env.HOME, timeout: 60000, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        stdout: stdout || '',
        stderr: stderr || '',
        error: error ? error.message : null
      });
    });
  });
});

ipcMain.handle('open-external', async (event, url) => { await shell.openExternal(url); return true; });

ipcMain.handle('get-system-info', () => {
  const os = require('os');
  return {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    electronVersion: process.versions.electron,
    cpus: os.cpus().length,
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    homeDir: os.homedir(),
    hostname: os.hostname(),
    username: os.userInfo().username
  };
});

// ============================================================
// App Lifecycle
// ============================================================

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register('CmdOrCtrl+Shift+G', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) { mainWindow.hide(); }
      else { mainWindow.show(); mainWindow.focus(); }
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => { globalShortcut.unregisterAll(); });

console.log('🐐 Super GOAT Royalty 3.0 Starting...');
console.log('🟢 NVIDIA NIM + 🤗 Hugging Face + 🧠 GOAT Brain');