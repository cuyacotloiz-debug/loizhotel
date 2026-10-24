# SQLite setup for backend/

This folder contains a simple SQLite schema and an initializer script to create `azurea.db` for local development.

Files added:
- `init.sql` — SQL schema + optional seed rows
- `init_db.js` — Node script that reads `init.sql` and creates `azurea.db`

Quick setup
1. From your project root, install the sqlite3 package (if you don't already have it):

```bash
npm install sqlite3 --save-dev
```

2. Run the initializer to create `backend/azurea.db`:

```bash
node backend/init_db.js
```

3. Open the DB with the VS Code SQLite extension: select `Open Database` and choose `backend/azurea.db`.

Example queries
- List reservations:

```sql
SELECT * FROM reservations ORDER BY created_at DESC;
```

- Insert a test inquiry:

```sql
INSERT INTO inquiries (name, email, subject, message) VALUES ('Tester','t@example.com','Hello','Is breakfast included?');
```

Node usage notes
- You can require `sqlite3` from any backend script and open `backend/azurea.db`:

```js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('backend/azurea.db');
db.all('SELECT * FROM newsletters', (err, rows) => { console.log(rows); db.close(); });
```

If you prefer a synchronous, simpler API consider adding `better-sqlite3` for server-side code.

Run API server

1. Install server deps (from project root or inside `backend/`):

```bash
cd backend
npm install express cors
```

2. Start the API server (defaults to port `3001`):

```bash
npm run start
```

3. Example frontend fetch (from Vite app running at `http://localhost:5173`):

```js
// create a reservation
fetch('http://localhost:3001/api/reservations', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ name: 'You', email: 'you@example.com', checkin: '2026-11-01', checkout: '2026-11-03' })
}).then(r => r.json()).then(console.log);

// get reservations
fetch('http://localhost:3001/api/reservations').then(r => r.json()).then(console.log);
```

