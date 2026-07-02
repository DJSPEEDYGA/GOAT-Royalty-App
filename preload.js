/**
 * SUPER GOAT ROYALTIES - Preload Script
 * Secure IPC bridge between renderer and main process
 * Uses contextBridge for safe inter-process communication
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // App info
    getAppInfo: () => ipcRenderer.invoke('get-app-info'),
    
    // Window controls
    minimize: () => ipcRenderer.send('minimize-window'),
    maximize: () => ipcRenderer.send('maximize-window'),
    close: () => ipcRenderer.send('close-window'),
    
    // Version info
    onVersionReply: (callback) => ipcRenderer.on('app-version', (_, version) => callback(version)),
    
    // Platform detection
    platform: process.platform,
    
    // Check if running in Electron
    isElectron: true
});