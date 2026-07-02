/**
 * GOAT Royalty Casino Routes
 * Owner-controlled casino endpoints. Default is fun-play and disabled.
 */

const express = require('express');
const CasinoEngine = require('./casino-engine');
const goatData = require('../goat-data');

const router = express.Router();

const casinoConfig = goatData.loadDataFile('goat-config.json')?.features?.casino || {};
const casino = new CasinoEngine(casinoConfig);

// Owner toggle secret from environment (simple gate; replace with real auth in production)
const OWNER_SECRET = process.env.GOAT_OWNER_SECRET || '';

function ownerRequired(req, res, next) {
    const secret = req.headers['x-owner-secret'] || req.body?.ownerSecret || '';
    if (!OWNER_SECRET || OWNER_SECRET !== secret) {
        return res.status(403).json({ error: 'Owner secret required to change casino state.' });
    }
    next();
}

function getPlayerId(req) {
    // In offline mode, derive a stable player id from a header or IP.
    return req.headers['x-player-id'] || `player-${req.ip}`;
}

// Get casino status
router.get('/casino/status', (req, res) => {
    res.json(casino.state());
});

// Get player state
router.get('/casino/player', (req, res) => {
    const playerId = getPlayerId(req);
    res.json(casino.playerState(playerId));
});

// Place a bet
router.post('/casino/bet', (req, res) => {
    const { game, wager, target, cashoutMultiplier, pick } = req.body;
    const playerId = getPlayerId(req);
    let result;

    switch (game) {
        case 'dice':
            result = casino.playDice(playerId, wager, target);
            break;
        case 'plinko':
            result = casino.playPlinko(playerId, wager);
            break;
        case 'crash':
            result = casino.playCrash(playerId, wager, cashoutMultiplier);
            break;
        case 'slots':
            result = casino.playSlots(playerId, wager);
            break;
        case 'blackjack':
            result = casino.playBlackjack(playerId, wager);
            break;
        case 'roulette':
            result = casino.playRoulette(playerId, wager, pick);
            break;
        case 'high-card':
            result = casino.playHighCard(playerId, wager);
            break;
        default:
            return res.status(400).json({ error: 'Unknown game.' });
    }

    res.json(result);
});

// Reset player balance
router.post('/casino/reset', (req, res) => {
    const playerId = getPlayerId(req);
    res.json(casino.resetPlayer(playerId));
});

// Owner: enable/disable casino
router.post('/casino/toggle', ownerRequired, (req, res) => {
    const { enabled } = req.body;
    res.json(casino.setEnabled(enabled));
});

// Owner: enable/disable real-money mode
router.post('/casino/real-money', ownerRequired, (req, res) => {
    const { enabled } = req.body;
    res.json(casino.setRealMoney(enabled));
});

router.casino = casino;
module.exports = router;
