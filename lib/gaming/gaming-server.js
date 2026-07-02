/**
 * GOAT Gaming Server Integration
 * Monitors and controls the GOAT City / Brick Squad RP FiveM server.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const goatData = require('../goat-data');

class GamingServerManager {
    constructor() {
        const config = goatData.loadDataFile('goat-config.json')?.features?.gaming_server || {};
        this.name = config.name || 'GOAT City RP';
        this.serverPath = config.path || '/opt/goat-city-rp';
        this.type = config.type || 'fivem';
        this.enabled = config.enabled || false;
        this.status = {
            online: false,
            players: 0,
            maxPlayers: 48,
            lastRestart: null,
            version: null,
            message: 'Status unknown'
        };
    }

    async getStatus() {
        if (!this.enabled) {
            this.status.message = 'Gaming server integration is disabled.';
            return this.status;
        }

        try {
            // Check if server directory exists
            const exists = fs.existsSync(this.serverPath);
            if (!exists) {
                this.status.online = false;
                this.status.message = `Server path not found: ${this.serverPath}`;
                return this.status;
            }

            // Check for running txAdmin / FXServer process (best-effort)
            const isRunning = await this.checkProcess();
            this.status.online = isRunning;
            this.status.message = isRunning ? 'Server appears online.' : 'Server process not detected.';

            // Read server config for max players if available
            const cfgPath = path.join(this.serverPath, 'server.cfg');
            if (fs.existsSync(cfgPath)) {
                const cfg = fs.readFileSync(cfgPath, 'utf8');
                const match = cfg.match(/sv_maxclients\s+(\d+)/i);
                if (match) this.status.maxPlayers = parseInt(match[1], 10);
            }

            return this.status;
        } catch (error) {
            this.status.online = false;
            this.status.message = error.message;
            return this.status;
        }
    }

    checkProcess() {
        return new Promise((resolve) => {
            exec('pgrep -f "FXServer|txAdmin" 2>/dev/null || true', (err, stdout) => {
                resolve(!!stdout.trim());
            });
        });
    }

    setEnabled(enabled) {
        this.enabled = Boolean(enabled);
        return { enabled: this.enabled };
    }

    toJSON() {
        return {
            name: this.name,
            type: this.type,
            path: this.serverPath,
            enabled: this.enabled,
            status: this.status
        };
    }
}

module.exports = GamingServerManager;
