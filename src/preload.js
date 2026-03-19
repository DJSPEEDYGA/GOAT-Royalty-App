// ============================================================
// Super GOAT Royalty 3.0 - Preload Script
// Secure bridge between renderer and main process
// ============================================================

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('superNinja', {
  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),

  // File operations
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),
  readBinary: (filePath) => ipcRenderer.invoke('read-binary', filePath),
  listDirectory: (dirPath) => ipcRenderer.invoke('list-directory', dirPath),
  saveDialog: (options) => ipcRenderer.invoke('save-dialog', options),
  openDialog: (options) => ipcRenderer.invoke('open-dialog', options),

  // Terminal
  executeCommand: (command, cwd) => ipcRenderer.invoke('execute-command', command, cwd),

  // System
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // Axiom Browser Automation
  axiomCreateBot: (name, desc) => ipcRenderer.invoke('axiom-create-bot', name, desc),
  axiomGetBots: () => ipcRenderer.invoke('axiom-get-bots'),
  axiomDeleteBot: (botId) => ipcRenderer.invoke('axiom-delete-bot', botId),
  axiomDuplicateBot: (botId) => ipcRenderer.invoke('axiom-duplicate-bot', botId),
  axiomAddStep: (botId, step) => ipcRenderer.invoke('axiom-add-step', botId, step),
  axiomRemoveStep: (botId, stepId) => ipcRenderer.invoke('axiom-remove-step', botId, stepId),
  axiomRunBot: (botId) => ipcRenderer.invoke('axiom-run-bot', botId),
  axiomStopBot: () => ipcRenderer.invoke('axiom-stop-bot'),
  axiomGetTemplates: () => ipcRenderer.invoke('axiom-get-templates'),
  axiomGetRunStatus: () => ipcRenderer.invoke('axiom-get-run-status'),

  // Event listeners from main process
  on: (channel, callback) => {
    const validChannels = [
      'new-chat', 'save-chat', 'export-pdf', 'export-md',
      'open-settings', 'open-tool', 'files-opened',
      'model-changed', 'goat-brain-toggled',
      'theme-changed', 'toggle-sidebar'
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },

  removeListener: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  }
});