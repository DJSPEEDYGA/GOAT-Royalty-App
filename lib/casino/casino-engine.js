/**
 * GOAT Royalty Casino Engine
 * Server-side game logic for the VIP fun-play casino floor.
 * Real-money mode is controlled by the owner via environment/config and is OFF by default.
 */

const { randomBytes } = require('crypto');

const slotSymbols = [
    { key: 'CROWN', label: 'Crown', mark: 'CR', multiplier: 10 },
    { key: 'GOAT', label: 'GOAT', mark: 'GT', multiplier: 8 },
    { key: '007', label: '007', mark: '07', multiplier: 6 },
    { key: 'MONEY', label: 'Money', mark: 'MP', multiplier: 5 },
    { key: 'LLM', label: 'LLM', mark: 'AI', multiplier: 3 },
    { key: 'VIP', label: 'VIP', mark: 'VP', multiplier: 2 },
    { key: 'STAR', label: 'Star', mark: 'ST', multiplier: 1 }
];

function rng() {
    return randomBytes(4).readUInt32LE(0) / 0xFFFFFFFF;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

class CasinoEngine {
    constructor(config = {}) {
        this.enabled = config.enabled || false;
        this.mode = config.mode || 'fun';
        this.realMoneyEnabled = config.real_money_enabled || false;
        this.currency = config.currency || 'VIP';
        this.startingBalance = config.starting_balance || 25000;
        this.maxWager = config.max_wager || 5000;
        this.players = new Map();
    }

    getOrCreatePlayer(playerId) {
        if (!this.players.has(playerId)) {
            this.players.set(playerId, {
                id: playerId,
                balance: this.startingBalance,
                wagered: 0,
                plays: 0,
                wins: 0,
                ledger: []
            });
        }
        return this.players.get(playerId);
    }

    validateWager(player, wager) {
        if (!this.enabled) return { ok: false, error: 'Casino is currently disabled by owner.' };
        if (this.mode !== 'fun' && !this.realMoneyEnabled) {
            return { ok: false, error: 'Real-money mode is locked. Enable it in owner settings.' };
        }
        const amount = Math.round(Number(wager));
        if (!Number.isFinite(amount) || amount < 10) {
            return { ok: false, error: 'Minimum wager is 10.' };
        }
        if (amount > this.maxWager) {
            return { ok: false, error: `Maximum wager is ${this.maxWager}.` };
        }
        if (amount > player.balance) {
            return { ok: false, error: 'Insufficient balance.' };
        }
        return { ok: true, amount };
    }

    addLedger(player, title, delta, details) {
        player.ledger.unshift({
            title,
            delta: Math.round(delta),
            details,
            time: new Date().toISOString()
        });
        player.ledger = player.ledger.slice(0, 50);
    }

    playDice(playerId, wager, target) {
        const player = this.getOrCreatePlayer(playerId);
        const valid = this.validateWager(player, wager);
        if (!valid.ok) return { error: valid.error };
        const bet = valid.amount;

        const roll = Math.floor(rng() * 100) + 1;
        const targetValue = clamp(Number(target) || 50, 1, 99);
        const won = roll >= targetValue;
        const multiplier = won ? (100 / (100 - targetValue)) : 0;
        const payout = won ? Math.round(bet * Math.min(multiplier, 10)) : 0;
        const profit = payout - bet;

        return this.settle(player, 'Royal Dice', bet, payout, profit, `Rolled ${roll} (target ${targetValue})`);
    }

    playPlinko(playerId, wager) {
        const player = this.getOrCreatePlayer(playerId);
        const valid = this.validateWager(player, wager);
        if (!valid.ok) return { error: valid.error };
        const bet = valid.amount;

        const buckets = [0.2, 0.5, 0.8, 1.0, 1.5, 2.0, 3.0, 5.0, 10.0];
        const weights = [1, 2, 3, 4, 3, 2, 2, 1, 0.5];
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let pick = rng() * totalWeight;
        let multiplier = buckets[0];
        for (let i = 0; i < buckets.length; i++) {
            pick -= weights[i];
            if (pick <= 0) {
                multiplier = buckets[i];
                break;
            }
        }
        const payout = Math.round(bet * multiplier);
        const profit = payout - bet;

        return this.settle(player, 'Royal Plinko', bet, payout, profit, `Plinko multiplier x${multiplier.toFixed(1)}`);
    }

    playCrash(playerId, wager, cashoutMultiplier) {
        const player = this.getOrCreatePlayer(playerId);
        const valid = this.validateWager(player, wager);
        if (!valid.ok) return { error: valid.error };
        const bet = valid.amount;

        const crash = 1 + (rng() * 5) + (rng() * rng() * 20);
        const cashout = clamp(Number(cashoutMultiplier) || 2.0, 1.01, 50);
        const won = cashout <= crash;
        const payout = won ? Math.round(bet * cashout) : 0;
        const profit = payout - bet;

        return this.settle(player, 'Crown Crash', bet, payout, profit, `Crashed at x${crash.toFixed(2)}, cashed out x${cashout.toFixed(2)}`);
    }

    playSlots(playerId, wager) {
        const player = this.getOrCreatePlayer(playerId);
        const valid = this.validateWager(player, wager);
        if (!valid.ok) return { error: valid.error };
        const bet = valid.amount;

        const reels = [
            slotSymbols[Math.floor(rng() * slotSymbols.length)],
            slotSymbols[Math.floor(rng() * slotSymbols.length)],
            slotSymbols[Math.floor(rng() * slotSymbols.length)]
        ];

        let multiplier = 0;
        if (reels[0].key === reels[1].key && reels[1].key === reels[2].key) {
            multiplier = reels[0].multiplier;
        } else if (reels[0].key === reels[1].key || reels[1].key === reels[2].key || reels[0].key === reels[2].key) {
            multiplier = 0.5;
        }

        const payout = Math.round(bet * multiplier);
        const profit = payout - bet;
        const symbols = reels.map(r => r.label).join(' | ');

        return this.settle(player, 'Crown Slots', bet, payout, profit, `Slots: ${symbols}`);
    }

    playBlackjack(playerId, wager) {
        const player = this.getOrCreatePlayer(playerId);
        const valid = this.validateWager(player, wager);
        if (!valid.ok) return { error: valid.error };
        const bet = valid.amount;

        const draw = () => Math.floor(rng() * 13) + 1;
        const value = (card) => Math.min(card, 10);
        const playerCards = [draw(), draw()];
        const dealerCards = [draw(), draw()];
        const playerTotal = value(playerCards[0]) + value(playerCards[1]);
        const dealerTotal = value(dealerCards[0]) + value(dealerCards[1]);

        let won = false;
        let push = false;
        let multiplier = 0;
        if (playerTotal === 21) {
            multiplier = 2.5;
            won = true;
        } else if (playerTotal > dealerTotal || dealerTotal > 21) {
            multiplier = 2.0;
            won = true;
        } else if (playerTotal === dealerTotal) {
            push = true;
            multiplier = 1.0;
        }

        const payout = Math.round(bet * multiplier);
        const profit = payout - bet;
        const result = push ? 'Push' : (won ? 'Win' : 'Loss');

        return this.settle(player, 'Studio Blackjack', bet, payout, profit, `Blackjack: ${playerTotal} vs dealer ${dealerTotal} (${result})`);
    }

    playRoulette(playerId, wager, pick) {
        const player = this.getOrCreatePlayer(playerId);
        const valid = this.validateWager(player, wager);
        if (!valid.ok) return { error: valid.error };
        const bet = valid.amount;

        const number = Math.floor(rng() * 37);
        const color = number === 0 ? 'green' : (number % 2 === 0 ? 'black' : 'red');
        const choice = String(pick || 'red').toLowerCase();

        let multiplier = 0;
        if (choice === 'green' && number === 0) multiplier = 35;
        else if ((choice === 'red' || choice === 'black') && color === choice) multiplier = 2;
        else if (!isNaN(Number(choice)) && Number(choice) === number) multiplier = 35;

        const payout = Math.round(bet * multiplier);
        const profit = payout - bet;

        return this.settle(player, 'GOAT Roulette', bet, payout, profit, `Roulette ${number} ${color}, you picked ${choice}`);
    }

    playHighCard(playerId, wager) {
        const player = this.getOrCreatePlayer(playerId);
        const valid = this.validateWager(player, wager);
        if (!valid.ok) return { error: valid.error };
        const bet = valid.amount;

        const playerCard = Math.floor(rng() * 13) + 1;
        const dealerCard = Math.floor(rng() * 13) + 1;
        const won = playerCard > dealerCard;
        const push = playerCard === dealerCard;
        const multiplier = push ? 1 : (won ? 2 : 0);
        const payout = Math.round(bet * multiplier);
        const profit = payout - bet;

        return this.settle(player, 'Crew High Card', bet, payout, profit, `High Card: ${playerCard} vs ${dealerCard}`);
    }

    settle(player, game, bet, payout, profit, details) {
        player.balance -= bet;
        player.balance += payout;
        player.wagered += bet;
        player.plays += 1;
        if (profit > 0) player.wins += 1;
        this.addLedger(player, game, profit, details);
        return {
            game,
            bet,
            payout,
            profit,
            balance: player.balance,
            wagered: player.wagered,
            plays: player.plays,
            wins: player.wins,
            details,
            mode: this.mode
        };
    }

    resetPlayer(playerId) {
        const player = this.getOrCreatePlayer(playerId);
        player.balance = this.startingBalance;
        player.wagered = 0;
        player.plays = 0;
        player.wins = 0;
        player.ledger = [];
        return this.playerState(playerId);
    }

    playerState(playerId) {
        const player = this.getOrCreatePlayer(playerId);
        return {
            id: player.id,
            balance: player.balance,
            wagered: player.wagered,
            plays: player.plays,
            wins: player.wins,
            winRate: player.plays ? Math.round((player.wins / player.plays) * 100) : 0,
            ledger: player.ledger,
            currency: this.currency,
            mode: this.mode
        };
    }

    setEnabled(enabled) {
        this.enabled = Boolean(enabled);
        return { enabled: this.enabled };
    }

    setRealMoney(enabled) {
        this.realMoneyEnabled = Boolean(enabled);
        if (this.realMoneyEnabled) this.mode = 'real';
        else this.mode = 'fun';
        return { realMoneyEnabled: this.realMoneyEnabled, mode: this.mode };
    }

    state() {
        return {
            enabled: this.enabled,
            mode: this.mode,
            realMoneyEnabled: this.realMoneyEnabled,
            currency: this.currency,
            startingBalance: this.startingBalance,
            maxWager: this.maxWager,
            games: ['dice', 'plinko', 'crash', 'slots', 'blackjack', 'roulette', 'high-card']
        };
    }
}

module.exports = CasinoEngine;
