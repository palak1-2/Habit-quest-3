// ═══════════════════════════════════════════════════
//  HabitQuest — Node.js Local Server
//  Reads and writes real JSON files on your hard disk
//
//  Files created in the same folder as this script:
//    • habits.json        — all your habits + user profile
//    • activity_log.json  — every completion/undo event
//
//  HOW TO RUN:
//    1. Install Node.js from https://nodejs.org
//    2. Open terminal in this folder
//    3. Run:  node server.js
//    4. Open browser → http://localhost:3000
// ═══════════════════════════════════════════════════

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT         = 3000;
const DIR          = __dirname;
const HABITS_FILE  = path.join(DIR, 'habits.json');
const LOG_FILE     = path.join(DIR, 'activity_log.json');
const HTML_FILE    = path.join(DIR, 'index.html');

// ── helpers ──────────────────────────────────────

function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return null;
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function initJSONFiles() {
  if (!fs.existsSync(HABITS_FILE)) {
    const defaultHabits = {
      meta: { createdAt: new Date().toISOString(), version: 1 },
      user: { name: '', points: 0, level: 1, totalXP: 0, earnedRewards: [], categoryStats: {} },
      nextId: 1,
      habits: []
    };
    writeJSON(HABITS_FILE, defaultHabits);
    console.log('  Created habits.json');
  }

  if (!fs.existsSync(LOG_FILE)) {
    const defaultLog = {
      meta: { createdAt: new Date().toISOString(), version: 1 },
      log: []
    };
    writeJSON(LOG_FILE, defaultLog);
    console.log('  Created activity_log.json');
  }
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function sendHTML(res) {
  try {
    const html = fs.readFileSync(HTML_FILE, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } catch (e) {
    res.writeHead(404);
    res.end('index.html not found — make sure it is in the same folder as server.js');
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch (e) { reject(e); }
    });
  });
}

// ── request router ────────────────────────────────

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // preflight CORS
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // ── serve the frontend ──
  if (method === 'GET' && url === '/') return sendHTML(res);

  // ── GET /api/habits — load habits.json ──
  if (method === 'GET' && url === '/api/habits') {
    const data = readJSON(HABITS_FILE);
    return sendJSON(res, 200, data || {});
  }

  // ── POST /api/habits — save habits.json ──
  if (method === 'POST' && url === '/api/habits') {
    try {
      const body = await readBody(req);
      body.meta = { ...body.meta, savedAt: new Date().toISOString() };
      writeJSON(HABITS_FILE, body);
      console.log(`[${new Date().toLocaleTimeString()}] habits.json saved (${body.habits?.length ?? 0} habits)`);
      return sendJSON(res, 200, { ok: true });
    } catch (e) {
      return sendJSON(res, 400, { ok: false, error: e.message });
    }
  }

  // ── GET /api/log — load activity_log.json ──
  if (method === 'GET' && url === '/api/log') {
    const data = readJSON(LOG_FILE);
    return sendJSON(res, 200, data || {});
  }

  // ── POST /api/log — save activity_log.json ──
  if (method === 'POST' && url === '/api/log') {
    try {
      const body = await readBody(req);
      body.meta = { ...body.meta, savedAt: new Date().toISOString() };
      writeJSON(LOG_FILE, body);
      console.log(`[${new Date().toLocaleTimeString()}] activity_log.json saved (${body.log?.length ?? 0} entries)`);
      return sendJSON(res, 200, { ok: true });
    } catch (e) {
      return sendJSON(res, 400, { ok: false, error: e.message });
    }
  }

  res.writeHead(404);
  res.end('Not found');
});

// ── boot ──────────────────────────────────────────

initJSONFiles();

server.listen(PORT, () => {
  console.log('\n  ⚡ HabitQuest server running!');
  console.log(`  Open → http://localhost:${PORT}`);
  console.log(`  Data → ${DIR}`);
  console.log('  Press Ctrl+C to stop\n');
});
