PRAGMA foreign_keys = ON;

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  checkin DATE,
  checkout DATE,
  guests INTEGER DEFAULT 1,
  room_type TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inquiries / contact messages
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter signups
CREATE TABLE IF NOT EXISTS newsletters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sample seed data (optional)
INSERT OR IGNORE INTO newsletters (id, email, subscribed_at) VALUES (1, 'hello@example.com', CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO inquiries (id, name, email, subject, message) VALUES
  (1, 'A. Guest', 'guest@example.com', 'Availability question', 'Do you have family rooms available?');

INSERT OR IGNORE INTO reservations (id, name, email, phone, checkin, checkout, guests, room_type) VALUES
  (1, 'Test Booker', 'booker@example.com', '+1234567890', '2026-11-01', '2026-11-05', 2, 'Ocean Suite');
