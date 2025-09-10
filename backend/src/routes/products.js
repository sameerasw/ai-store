const express = require('express');
const { all, get } = require('../db');

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

module.exports = router;
