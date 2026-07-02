/**
 * GOAT Gaming Server Routes
 */

const express = require('express');
const GamingServerManager = require('./gaming-server');

const router = express.Router();
const gamingServer = new GamingServerManager();
const OWNER_SECRET = process.env.GOAT_OWNER_SECRET || '';

function ownerRequired(req, res, next) {
    const secret = req.headers['x-owner-secret'] || req.body?.ownerSecret || '';
    if (!OWNER_SECRET || OWNER_SECRET !== secret) {
        return res.status(403).json({ error: 'Owner secret required to change gaming server state.' });
    }
    next();
}

router.get('/gaming-server/status', async (req, res) => {
    try {
        await gamingServer.getStatus();
        res.json(gamingServer.toJSON());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/gaming-server/toggle', ownerRequired, (req, res) => {
    const { enabled } = req.body;
    res.json(gamingServer.setEnabled(enabled));
});

router.gamingServer = gamingServer;
module.exports = router;
