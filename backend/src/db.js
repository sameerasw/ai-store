const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'ai-store.sqlite');

let db;

function connect() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  db = new sqlite3.Database(DB_PATH);
  return db;
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, function (err, row) {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, function (err, rows) {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function init() {
  connect();
  // Create tables
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'user'
  )`);

  await run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category TEXT,
    tags TEXT
  )`);

  await run(`CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    discount_percent REAL NOT NULL,
    active INTEGER NOT NULL DEFAULT 1
  )`);

  await run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    products TEXT NOT NULL, -- JSON array of {productId, qty}
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Seed default users if empty
  const userCount = await get('SELECT COUNT(*) as c FROM users');
  if (userCount.c === 0) {
    const bcrypt = require('bcryptjs');
    const adminPass = await bcrypt.hash('admin123', 10);
    const userPass = await bcrypt.hash('user123', 10);
    await run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['admin', adminPass, 'admin']);
    await run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['user', userPass, 'user']);
  }

  // Seed some products if empty
  const prodCount = await get('SELECT COUNT(*) as c FROM products');
  if (prodCount.c === 0) {
    const sample = [
      ['Echo Speaker', 'Smart speaker with voice assistant', 49.99, 50, 'Electronics', 'smart,home,assistant'],
      ['AI Vacuum', 'Robot vacuum cleaner with mapping', 199.0, 20, 'Home', 'robot,cleaning,home'],
      ['Wireless Headphones', 'Noise-cancelling over-ear', 129.99, 35, 'Electronics', 'audio,wireless,headphones'],
      ['Smartwatch', 'Fitness tracking and notifications', 99.99, 40, 'Wearables', 'fitness,watch,smart'],
      ['Gaming Mouse', 'High DPI ergonomic mouse', 39.99, 60, 'Accessories', 'gaming,mouse,ergonomic']
    ];
    for (const p of sample) {
      await run('INSERT INTO products (name, description, price, stock, category, tags) VALUES (?, ?, ?, ?, ?, ?)', p);
    }
  }

  const offerCount = await get('SELECT COUNT(*) as c FROM offers');
  if (offerCount.c === 0) {
    await run('INSERT INTO offers (title, description, discount_percent, active) VALUES (?, ?, ?, ?)', [
      'Back to School', 'Save on study essentials', 15, 1
    ]);
    await run('INSERT INTO offers (title, description, discount_percent, active) VALUES (?, ?, ?, ?)', [
      'Weekend Flash Sale', 'Limited-time discounts!', 25, 1
    ]);
  }
}

module.exports = { db: () => db, run, get, all, init, DB_PATH };
