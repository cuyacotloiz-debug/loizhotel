const express = require('express');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'azurea.db');
const SQL_SCHEMA = path.join(__dirname, 'init.sql');

function ensureSchema(db) {
  if (fs.existsSync(SQL_SCHEMA)) {
    const sql = fs.readFileSync(SQL_SCHEMA, 'utf8');
    db.exec(sql, (err) => {
      if (err) console.error('Error applying schema:', err.message);
      else console.log('Schema ensured.');
    });
  } else {
    console.warn('init.sql not found; skipping schema apply.');
  }
}

const app = express();
app.use(express.json());

// allow frontend running on vite default
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to open DB:', err.message);
    process.exit(1);
  }
  console.log('Connected to', DB_PATH);
  ensureSchema(db);
});

// --- Reservations ---
app.get('/api/reservations', (req, res) => {
  db.all('SELECT * FROM reservations ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/reservations', (req, res) => {
  const { name, email, phone, checkin, checkout, guests = 1, room_type, notes } = req.body;
  const stmt = db.prepare(
    `INSERT INTO reservations (name,email,phone,checkin,checkout,guests,room_type,notes) VALUES (?,?,?,?,?,?,?,?)`
  );
  stmt.run([name, email, phone, checkin, checkout, guests, room_type, notes], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// --- Inquiries ---
app.get('/api/inquiries', (req, res) => {
  db.all('SELECT * FROM inquiries ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/inquiries', (req, res) => {
  const { name, email, subject, message } = req.body;
  const stmt = db.prepare(`INSERT INTO inquiries (name,email,subject,message) VALUES (?,?,?,?)`);
  stmt.run([name, email, subject, message], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// --- Newsletter ---
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  const stmt = db.prepare(`INSERT OR IGNORE INTO newsletters (email) VALUES (?)`);
  stmt.run([email], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`API server listening on http://localhost:${PORT}`));
