const express = require('express');
const { all, get, run } = require('../db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

// List products with optional filters: q, category, tags (comma separated)
router.get('/', async (req, res) => {
  const { q, category, tags } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];
  if (q) {
    sql += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)';
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (tags) {
    const t = tags.split(',').map(s => s.trim()).filter(Boolean);
    for (const tag of t) {
      sql += ' AND tags LIKE ?';
      params.push(`%${tag}%`);
    }
  }
  try {
    const rows = await all(sql, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const row = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Admin-only CRUD
router.post('/', authRequired, adminRequired, async (req, res) => {
  const { name, description, price, stock, category, tags } = req.body || {};
  if (!name || price == null) return res.status(400).json({ error: 'name and price required' });
  try {
    const r = await run('INSERT INTO products (name, description, price, stock, category, tags) VALUES (?, ?, ?, ?, ?, ?)', [
      name, description || '', Number(price), Number(stock || 0), category || '', tags || ''
    ]);
    const created = await get('SELECT * FROM products WHERE id = ?', [r.id]);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/:id', authRequired, adminRequired, async (req, res) => {
  const { name, description, price, stock, category, tags } = req.body || {};
  try {
    const existing = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Not found' });
    await run('UPDATE products SET name=?, description=?, price=?, stock=?, category=?, tags=? WHERE id=?', [
      name ?? existing.name,
      description ?? existing.description,
      price != null ? Number(price) : existing.price,
      stock != null ? Number(stock) : existing.stock,
      category ?? existing.category,
      tags ?? existing.tags,
      req.params.id
    ]);
    const updated = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    await run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
