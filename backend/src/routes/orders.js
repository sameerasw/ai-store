const express = require('express');
const { all, get, run } = require('../db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

// List orders for current user
router.get('/', authRequired, async (req, res) => {
  try {
    const rows = await all('SELECT * FROM orders WHERE user_id = ? ORDER BY datetime(created_at) DESC', [req.user.id]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin: list all orders
router.get('/all', authRequired, adminRequired, async (req, res) => {
  try {
    const rows = await all('SELECT * FROM orders ORDER BY datetime(created_at) DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order if owner or admin
router.get('/:id', authRequired, async (req, res) => {
  try {
    const row = await get('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    if (row.user_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order: body { items: [{productId, qty}] }
router.post('/', authRequired, async (req, res) => {
  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items required' });
  try {
    const productsJson = JSON.stringify(items);
    const r = await run('INSERT INTO orders (user_id, products, status) VALUES (?, ?, ?)', [req.user.id, productsJson, 'pending']);
    const created = await get('SELECT * FROM orders WHERE id = ?', [r.id]);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status (admin)
router.put('/:id/status', authRequired, adminRequired, async (req, res) => {
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ error: 'status required' });
  try {
    const existing = await get('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Not found' });
    await run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    const updated = await get('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
