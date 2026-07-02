/**
 * AGENT-007 UI API routes
 * Provides the endpoints the AGENT-007 single-page UI expects:
 * - Ollama proxy for local LLM inference
 * - Chat / settings persistence
 * - Hardware stats
 * - Crew profiles, vault protocol, diary
 * - Workspace bridge, tool mode, owner approval
 * - GOAT model-pack catalog
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const os = require('os');
const http = require('http');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'agent-007');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const CHATS_FILE = path.join(DATA_DIR, 'chats.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const OWNER_APPROVAL_FILE = path.join(DATA_DIR, 'owner-approval.json');
const TOOL_POLICY_FILE = path.join(DATA_DIR, 'tool-policy.json');

function loadJson(file, defaultValue = {}) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error('[AGENT-007] Error loading', file, e.message);
  }
  return defaultValue;
}

function saveJson(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('[AGENT-007] Error saving', file, e.message);
  }
}

// ========== OLLAMA PROXY ==========
const OLLAMA_HOST = process.env.OLLAMA_HOST || '127.0.0.1';
const OLLAMA_PORT = process.env.OLLAMA_PORT || 11434;

router.all('/ollama/*', (req, res) => {
  const targetPath = req.path.replace(/^\/ollama/, '');
  const options = {
    hostname: OLLAMA_HOST,
    port: OLLAMA_PORT,
    path: targetPath + (req.url.includes('?') ? '?' + req.url.split('?')[1] : ''),
    method: req.method,
    headers: { ...req.headers, host: `${OLLAMA_HOST}:${OLLAMA_PORT}` }
  };

  delete options.headers['content-length'];

  const proxy = http.request(options, (proxyRes) => {
    res.status(proxyRes.statusCode);
    Object.entries(proxyRes.headers).forEach(([k, v]) => res.setHeader(k, v));
    proxyRes.pipe(res);
  });

  proxy.on('error', (err) => {
    console.error('[AGENT-007] Ollama proxy error:', err.message);
    res.status(503).json({ error: 'Ollama not available', details: err.message });
  });

  if (req.body && Object.keys(req.body).length) {
    proxy.write(JSON.stringify(req.body));
  }
  req.pipe(proxy, { end: true });
});

// ========== CHATS ==========
router.get('/api/chats', (req, res) => {
  res.json(loadJson(CHATS_FILE, []));
});

router.post('/api/chats', (req, res) => {
  saveJson(CHATS_FILE, req.body || []);
  res.json({ success: true });
});

// ========== SETTINGS ==========
router.get('/api/settings', (req, res) => {
  res.json(loadJson(SETTINGS_FILE, {}));
});

router.post('/api/settings', (req, res) => {
  const existing = loadJson(SETTINGS_FILE, {});
  const updated = { ...existing, ...req.body };
  saveJson(SETTINGS_FILE, updated);
  res.json({ success: true, settings: updated });
});

// ========== HARDWARE STATS ==========
router.get('/api/stats', (req, res) => {
  const cpus = os.cpus();
  const loadAvgs = os.loadavg();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  res.json({
    cpu: {
      cores: cpus.length,
      model: cpus[0]?.model || 'unknown',
      loadAvg: loadAvgs,
      percent: Math.min(100, Math.round((loadAvgs[0] / cpus.length) * 100))
    },
    memory: {
      total: totalMem,
      free: freeMem,
      used: totalMem - freeMem,
      percent: Math.round(((totalMem - freeMem) / totalMem) * 100)
    },
    platform: os.platform(),
    uptime: os.uptime()
  });
});

// ========== GOAT LOCAL MODEL PACK ==========
router.get('/api/goat/local-model-pack', (req, res) => {
  const aiConfig = require('../ai/ai-config');
  const installed = require('../ai/local-llm').getLocalLLM().listModels();
  res.json({
    ok: true,
    installed: installed.map(m => ({
      name: m.id,
      family: m.family,
      size: m.size,
      quantization: m.quantization,
      sizeGB: m.sizeGB,
      loaded: m.loaded
    })),
    available: Object.entries(aiConfig.local?.availableModels || {}).map(([k, v]) => ({
      name: k,
      ...v
    }))
  });
});

// ========== MONEY PENNY PROTOCOL ==========
const MONEYPENNY_PROTOCOL_PATH = path.join(__dirname, '..', '..', 'data', 'agent-007', 'moneypenny-protocol.txt');

router.get('/api/money-penny/protocol', (req, res) => {
  try {
    const protocolText = fs.existsSync(MONEYPENNY_PROTOCOL_PATH)
      ? fs.readFileSync(MONEYPENNY_PROTOCOL_PATH, 'utf8')
      : '# GOAT VAULT PROTOCOL // MONEYPENNY VERSION 7.0\n\nProtocol file not found locally. Ensure the AGENT-007 drive is mounted.';
    res.json({ ok: true, protocol: protocolText });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ========== CREW PROFILES ==========
const CREW_PROFILES = {
  'money-penny': {
    name: 'Money Penny',
    role: 'AI Powerhouse of GOAT Royalty',
    systemPrompt: 'You are Money Penny, the AI powerhouse of GOAT Royalty. Coordinate projects, protect intellectual property, and manage business operations for the creator and the GOAT Royalty Force.'
  },
  'lexicon-lexi': {
    name: 'Lexicon Lexi',
    role: 'Technical Strategist',
    systemPrompt: 'You are Lexicon Lexi, a protected GOAT/AGENT-007 team lane and source profile. Handle C++, Python, local app engineering, defensive cybersecurity, crypto/blockchain analysis, technical research, and automation.'
  },
  'ms-vanessa': {
    name: 'Ms. Vanessa',
    role: 'Creative Director',
    systemPrompt: 'You are Ms. Vanessa, creative director for the GOAT Royalty Force. Guide music, film, art, and brand direction.'
  },
  'ms-nexus': {
    name: 'Ms. Nexus',
    role: 'Network & Partnerships',
    systemPrompt: 'You are Ms. Nexus, network and partnerships lead for the GOAT Royalty Force. Build connections, sync opportunities, and collaboration strategy.'
  },
  'sir-codex': {
    name: 'Sir Codex',
    role: 'Code & Systems Guardian',
    systemPrompt: 'You are Sir Codex, code guardian and systems architect for AGENT-007 and the GOAT Royalty Force. Deliver secure, working code and system designs.'
  },
  'cody-sidekick': {
    name: 'Cody Sidekick',
    role: 'Developer Assistant',
    systemPrompt: 'You are Cody Sidekick, the helpful developer assistant for AGENT-007. Write code, debug issues, and explain technical concepts.'
  },
  'drive-vault': {
    name: 'Drive Vault',
    role: 'GOAT Knowledge Vault',
    systemPrompt: 'You are Drive Vault, the GOAT knowledge vault. Answer from the owner\'s protected GOAT Royalty documents, protocols, and creative archives when available.'
  }
};

function crewProfileRoute(key) {
  router.get(`/api/${key}/profile`, (req, res) => {
    const profile = CREW_PROFILES[key.replace(/-/g, '')] || CREW_PROFILES[key];
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json({ ok: true, profile });
  });
}

Object.keys(CREW_PROFILES).forEach(key => crewProfileRoute(key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()));

// ========== AGENT-007 VAULT PROTOCOL & DIARY ==========
const VAULT_PROTOCOL_FILE = path.join(DATA_DIR, 'vault-protocol.md');
const DIARY_FILE = path.join(DATA_DIR, 'diary.json');

router.get('/api/agent-007/vault-protocol', (req, res) => {
  const profileText = fs.existsSync(VAULT_PROTOCOL_FILE)
    ? fs.readFileSync(VAULT_PROTOCOL_FILE, 'utf8')
    : '# AGENT-007 Vault Protocol\n\nDefault protocol loaded. Owner can customize via AGENT-007 UI.';
  res.json({ ok: true, profile: profileText });
});

router.get('/api/agent-007/diary', (req, res) => {
  res.json({ ok: true, profile: loadJson(DIARY_FILE, { notes: [] }) });
});

router.post('/api/agent-007/diary', (req, res) => {
  const existing = loadJson(DIARY_FILE, { notes: [] });
  const note = req.body?.note || req.body;
  if (note && typeof note === 'string') {
    existing.notes.push({ text: note, time: new Date().toISOString() });
  } else if (note && typeof note === 'object') {
    existing.notes.push({ ...note, time: new Date().toISOString() });
  }
  saveJson(DIARY_FILE, existing);
  res.json({ ok: true, profile: existing });
});

// ========== WORKSPACE BRIDGE ==========
router.get('/api/workspace', (req, res) => {
  res.json({
    ok: true,
    root: process.cwd(),
    platform: os.platform(),
    note: 'Read-only workspace snapshot via AGENT-007 bridge.'
  });
});

// ========== OWNER APPROVAL ==========
router.get('/api/owner-approval', (req, res) => {
  const data = loadJson(OWNER_APPROVAL_FILE, { ok: false, configured: false });
  res.json({ ok: true, configured: data.configured || false });
});

router.post('/api/owner-approval/setup', (req, res) => {
  const { passphrase, code } = req.body;
  const secret = passphrase || code || 'owner-secret';
  saveJson(OWNER_APPROVAL_FILE, { configured: true, secretHash: Buffer.from(secret).toString('base64') });
  res.json({ ok: true, configured: true });
});

router.post('/api/owner-approval/unlock', (req, res) => {
  const { passphrase, code } = req.body;
  const data = loadJson(OWNER_APPROVAL_FILE, { configured: false, secretHash: '' });
  if (!data.configured) return res.status(400).json({ ok: false, error: 'Owner approval not configured' });
  const provided = Buffer.from(passphrase || code || '').toString('base64');
  const ok = provided === data.secretHash;
  if (ok) {
    res.json({ ok: true, token: 'owner-token-' + Date.now(), expiresAt: Date.now() + 30 * 60 * 1000 });
  } else {
    res.status(401).json({ ok: false, error: 'Invalid owner code' });
  }
});

router.post('/api/owner-approval/lock', (req, res) => {
  res.json({ ok: true, locked: true });
});

// ========== TOOL MODE ==========
router.get('/api/tools', (req, res) => {
  res.json({
    ok: true,
    runWriteEnabled: true,
    readOnly: false,
    localhostOnly: false,
    tools: ['list_running_apps', 'open_path', 'open_url', 'diagnose', 'list_apps', 'open_store', 'open_public']
  });
});

router.get('/api/tools/policy', (req, res) => {
  res.json({
    ok: true,
    policy: loadJson(TOOL_POLICY_FILE, {
      allowWrite: true,
      allowExec: false,
      requireOwnerApproval: true,
      message: 'Tool Mode is enabled. Owner approval required for write/exec actions.'
    })
  });
});

router.post('/api/tools/policy', (req, res) => {
  saveJson(TOOL_POLICY_FILE, req.body || {});
  res.json({ ok: true });
});

router.post('/api/ollama/prepare-mac-mini', (req, res) => {
  res.json({ ok: true, message: 'Prepare request acknowledged. Ensure Ollama is running locally.' });
});

// ========== GOAT API PASSTHROUGH (used by some UI tools) ==========
router.get('/api/goat/status', (req, res) => {
  res.json({
    ok: true,
    app: 'AGENT-007 + GOAT Royalty',
    version: '5.1.0',
    mode: 'local',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
