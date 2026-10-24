const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_FILE = path.join(__dirname, 'azurea.db');
const SQL_FILE = path.join(__dirname, 'init.sql');

function init() {
  if (!fs.existsSync(SQL_FILE)) {
    console.error('init.sql not found in backend/. Create or place the schema file at backend/init.sql');
    process.exit(1);
  }

  const sql = fs.readFileSync(SQL_FILE, 'utf8');

  const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) return console.error('Failed to open DB:', err.message);
    console.log('Opened database at', DB_FILE);
  });

  db.exec(sql, (err) => {
    if (err) {
      console.error('Failed to initialize schema:', err.message);
      db.close();
      process.exit(1);
    }
    console.log('Schema applied successfully. DB ready at', DB_FILE);
    db.close();
  });
}

if (require.main === module) init();

module.exports = { DB_FILE };
