const express = require('express');
const { all, get, run } = require('../db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM offers WHERE active = 1');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

// Admin CRUD
router.post('/', authRequired, adminRequired, async (req, res) => {
  const { title, description, discount_percent, active } = req.body || {};
  if (!title || discount_percent == null) return res.status(400).json({ error: 'title and discount_percent required' });
  try {
    const r = await run('INSERT INTO offers (title, description, discount_percent, active) VALUES (?, ?, ?, ?)', [
      title, description || '', Number(discount_percent), active ? 1 : 0
    ]);
    const created = await get('SELECT * FROM offers WHERE id = ?', [r.id]);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

router.put('/:id', authRequired, adminRequired, async (req, res) => {
  const { title, description, discount_percent, active } = req.body || {};
  try {
    const existing = await get('SELECT * FROM offers WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Not found' });
    await run('UPDATE offers SET title=?, description=?, discount_percent=?, active=? WHERE id=?', [
      title ?? existing.title,
      description ?? existing.description,
      discount_percent != null ? Number(discount_percent) : existing.discount_percent,
      active != null ? (active ? 1 : 0) : existing.active,
      req.params.id
    ]);
    const updated = await get('SELECT * FROM offers WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update offer' });
  }
});

router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    await run('DELETE FROM offers WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete offer' });
  }
});

module.exports = router;
