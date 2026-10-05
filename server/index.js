// Aeethod OS — local API server.
// Stores all company data in a single JSON file (data/db.json) so it is portable,
// human-readable, git-versionable and has zero plan limits.
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { buildSeed } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const DIST_DIR = path.join(ROOT, 'dist');
const PORT = Number(process.env.API_PORT || 4317);

const COLLECTIONS = ['topics', 'tasks', 'docs', 'fields', 'metrics', 'sprints', 'epics', 'content_videos'];

// ---------- persistence ----------
function writeNow(data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const json = JSON.stringify(data, null, 2);
  const tmp = DB_FILE + '.tmp';
  try {
    fs.writeFileSync(tmp, json);
    fs.renameSync(tmp, DB_FILE);
  } catch {
    // Windows can refuse the rename if the file is momentarily locked (AV, editors).
    fs.writeFileSync(DB_FILE, json);
  }
}

function normalize(data) {
  for (const c of COLLECTIONS) if (!Array.isArray(data[c])) data[c] = [];
  if (!data.settings || typeof data.settings !== 'object') data.settings = {};
  if (!Array.isArray(data.settings.team)) data.settings.team = [];
  return data;
}

function load() {
  if (!fs.existsSync(DB_FILE)) {
    const seed = buildSeed();
    writeNow(seed);
    console.log('[aeethod-os] Created new database with seed data at', DB_FILE);
    return seed;
  }
  return normalize(JSON.parse(fs.readFileSync(DB_FILE, 'utf8')));
}

function backup(reason = 'auto') {
  if (!fs.existsSync(DB_FILE)) return;
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.copyFileSync(DB_FILE, path.join(BACKUP_DIR, `${stamp}-${reason}.json`));
  // keep the 30 most recent backups
  const files = fs.readdirSync(BACKUP_DIR).filter((f) => f.endsWith('.json')).sort();
  for (const f of files.slice(0, Math.max(0, files.length - 30))) fs.unlinkSync(path.join(BACKUP_DIR, f));
}

let db = load();
backup('startup');

let timer = null;
function persist() {
  clearTimeout(timer);
  timer = setTimeout(() => writeNow(db), 120);
}
function flush() {
  clearTimeout(timer);
  writeNow(db);
}

// ---------- cascade rules ----------
function descendantTaskIds(rootId) {
  const ids = new Set([rootId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const t of db.tasks) {
      if (t.parentId && ids.has(t.parentId) && !ids.has(t.id)) {
        ids.add(t.id);
        grew = true;
      }
    }
  }
  return ids;
}

function cascadeDelete(col, id) {
  if (col === 'tasks') {
    const ids = descendantTaskIds(id);
    db.tasks = db.tasks.filter((t) => !ids.has(t.id));
    return;
  }
  db[col] = db[col].filter((x) => x.id !== id);
  if (col === 'topics') {
    db.tasks = db.tasks.filter((t) => t.topicId !== id);
    db.docs = db.docs.filter((d) => d.topicId !== id);
    db.fields = db.fields.filter((f) => f.topicId !== id);
  }
  if (col === 'fields') {
    for (const t of db.tasks) if (t.fields && id in t.fields) delete t.fields[id];
  }
  if (col === 'sprints') for (const t of db.tasks) if (t.sprintId === id) t.sprintId = null;
  if (col === 'epics') for (const t of db.tasks) if (t.epicId === id) t.epicId = null;
}

// ---------- app ----------
const app = express();
app.use(express.json({ limit: '25mb' }));

const validCol = (req, res, next) => {
  if (!COLLECTIONS.includes(req.params.col)) return res.status(404).json({ error: `Unknown collection "${req.params.col}"` });
  next();
};

app.get('/api/health', (_req, res) => res.json({ ok: true, file: DB_FILE }));

app.get('/api/db', (_req, res) => res.json(db));

app.put('/api/db', (req, res) => {
  const incoming = req.body;
  if (!incoming || typeof incoming !== 'object' || !Array.isArray(incoming.topics) || !Array.isArray(incoming.tasks)) {
    return res.status(400).json({ error: 'Invalid database file: expected topics[] and tasks[]' });
  }
  backup('before-import');
  db = normalize(incoming);
  flush();
  res.json(db);
});

app.post('/api/reset', (_req, res) => {
  backup('before-reset');
  db = buildSeed();
  flush();
  res.json(db);
});

app.patch('/api/settings', (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  persist();
  res.json(db.settings);
});

app.post('/api/:col', validCol, (req, res) => {
  const now = new Date().toISOString();
  const item = { ...req.body, id: req.body.id || randomUUID(), createdAt: req.body.createdAt || now, updatedAt: now };
  if (db[req.params.col].some((x) => x.id === item.id)) return res.status(409).json({ error: 'Duplicate id' });
  db[req.params.col].push(item);
  persist();
  res.status(201).json(item);
});

app.patch('/api/:col/:id', validCol, (req, res) => {
  const list = db[req.params.col];
  const idx = list.findIndex((x) => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const { id: _ignore, createdAt: _c, ...patch } = req.body;
  list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
  persist();
  res.json(list[idx]);
});

app.delete('/api/:col/:id', validCol, (req, res) => {
  cascadeDelete(req.params.col, req.params.id);
  persist();
  res.json({ ok: true });
});

// Serve the production build if it exists (npm run build && npm start)
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`[aeethod-os] API listening on http://localhost:${PORT}  (data: ${DB_FILE})`);
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    flush();
    process.exit(0);
  });
}
