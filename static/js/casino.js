/**
 * GOAT Royalty Casino Client
 */

let casinoState = { enabled: false, mode: 'fun', realMoneyEnabled: false };
let playerState = { balance: 0, wagered: 0, plays: 0, wins: 0, ledger: [] };

async function api(path, method = 'GET', body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(path, opts);
  return res.json();
}

async function loadStatus() {
  try {
    casinoState = await api('/api/casino/status');
    playerState = await api('/api/casino/player');
    updateUI();
  } catch (e) {
    console.error('Casino load failed', e);
  }
}

function updateUI() {
  const statusEl = document.getElementById('casinoStatus');
  statusEl.textContent = casinoState.enabled
    ? (casinoState.realMoneyEnabled ? 'Real-Money Mode Enabled' : 'Fun-Play Mode Enabled')
    : 'Casino Floor Disabled';
  statusEl.className = 'casino-status ' + (casinoState.enabled ? 'enabled' : 'disabled');

  document.getElementById('enableCasino').checked = casinoState.enabled;
  document.getElementById('enableRealMoney').checked = casinoState.realMoneyEnabled;

  const content = document.getElementById('casinoContent');
  const overlay = document.getElementById('disabledOverlay');
  if (casinoState.enabled) {
    content.style.display = 'block';
    overlay.style.display = 'none';
  } else {
    content.style.display = 'none';
    overlay.style.display = 'block';
  }

  document.getElementById('balanceText').textContent = playerState.balance.toLocaleString();
  document.getElementById('wageredText').textContent = playerState.wagered.toLocaleString();
  document.getElementById('playsText').textContent = playerState.plays;
  document.getElementById('winRateText').textContent = playerState.plays ? Math.round((playerState.wins / playerState.plays) * 100) + '%' : '0%';

  const ledgerEl = document.getElementById('ledger');
  if (!playerState.ledger?.length) {
    ledgerEl.innerHTML = '<div class="muted">No plays yet.</div>';
  } else {
    ledgerEl.innerHTML = playerState.ledger.map(item => `
      <div class="ledger-entry ${item.delta >= 0 ? 'win' : 'loss'}">
        <div><strong>${item.title}</strong><br><small>${item.details}</small></div>
        <div>${item.delta >= 0 ? '+' : ''}${item.delta.toLocaleString()}</div>
      </div>
    `).join('');
  }
}

async function playGame(game) {
  const wagerInput = document.getElementById(game === 'high-card' ? 'highcardWager' : `${game}Wager`);
  const resultEl = document.getElementById(`${game}Result`);
  const wager = Number(wagerInput?.value || 100);

  resultEl.className = 'result';
  resultEl.textContent = 'Playing...';

  try {
    const body = { game, wager };
    if (game === 'dice') body.target = document.getElementById('diceTarget').value;
    if (game === 'crash') body.cashoutMultiplier = document.getElementById('crashCashout').value;
    if (game === 'roulette') body.pick = document.getElementById('roulettePick').value;

    const result = await api('/api/casino/bet', 'POST', body);
    if (result.error) {
      resultEl.textContent = result.error;
      resultEl.className = 'result loss';
      return;
    }

    playerState = result;
    resultEl.textContent = `${result.details}. Profit ${result.profit >= 0 ? '+' : ''}${result.profit.toLocaleString()} ${result.currency || 'VIP'}. Balance: ${result.balance.toLocaleString()}`;
    resultEl.className = 'result ' + (result.profit >= 0 ? 'win' : 'loss');
    updateUI();
  } catch (e) {
    resultEl.textContent = 'Network or server error. Is the casino enabled?';
    resultEl.className = 'result loss';
  }
}

async function saveOwnerSettings() {
  const secret = document.getElementById('ownerSecret').value;
  const enabled = document.getElementById('enableCasino').checked;
  const realMoney = document.getElementById('enableRealMoney').checked;

  try {
    await api('/api/casino/toggle', 'POST', { enabled, ownerSecret: secret });
    await api('/api/casino/real-money', 'POST', { enabled: realMoney, ownerSecret: secret });
    await loadStatus();
    alert('Owner settings applied.');
  } catch (e) {
    alert('Failed to apply settings. Check owner secret and server logs.');
  }
}

function showOwnerPanel() {
  const hash = window.location.hash;
  const panel = document.getElementById('ownerPanel');
  if (hash === '#owner') panel.classList.add('active');
}

window.addEventListener('hashchange', showOwnerPanel);
showOwnerPanel();
loadStatus();
