const express = require('express');
const { all } = require('../db');

const router = express.Router();

// Simple keyword-based chatbot that searches products
router.post('/', async (req, res) => {
  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message required' });
  }

  const q = message.trim();
  try {
    // naive keyword extract: split by spaces, take top few tokens
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 5);
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    for (const t of tokens) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)';
      const like = `%${t}%`;
      params.push(like, like, like);
    }
    sql += ' LIMIT 10';
    const products = await all(sql, params);

    const reply = products.length
      ? `Here are some products matching: "${q}"`
      : `I couldn't find products for "${q}". Try different keywords like category or brand.`;

    res.json({ reply, products });
  } catch (e) {
    res.status(500).json({ error: 'Chat failed' });
  }
});

module.exports = router;
