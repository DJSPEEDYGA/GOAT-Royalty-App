/**
 * GOAT Gaming Server Client
 */

async function api(path, method = 'GET', body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(path, opts);
  return res.json();
}

async function loadStatus() {
  try {
    const data = await api('/api/gaming-server/status');
    document.getElementById('serverName').textContent = data.name || 'GOAT City RP';
    document.getElementById('serverType').textContent = data.type || 'fivem';
    document.getElementById('playerCount').textContent = data.status?.players ?? 0;
    document.getElementById('maxPlayers').textContent = data.status?.maxPlayers ?? 48;

    const statusEl = document.getElementById('serverStatus');
    if (data.status?.online) {
      statusEl.textContent = 'Online';
      statusEl.className = 'value online';
    } else {
      statusEl.textContent = 'Offline';
      statusEl.className = 'value offline';
    }

    document.getElementById('enableGaming').checked = data.enabled;
  } catch (e) {
    console.error('Gaming server status failed', e);
    document.getElementById('serverStatus').textContent = 'Error';
  }
}

async function saveGamingSettings() {
  const secret = document.getElementById('ownerSecret').value;
  const enabled = document.getElementById('enableGaming').checked;
  try {
    await api('/api/gaming-server/toggle', 'POST', { enabled, ownerSecret: secret });
    await loadStatus();
    alert('Gaming server settings applied.');
  } catch (e) {
    alert('Failed to apply settings. Check owner secret.');
  }
}

loadStatus();
