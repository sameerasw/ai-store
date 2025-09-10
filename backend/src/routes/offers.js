const express = require('express');
const { all } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM offers WHERE active = 1');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

module.exports = router;
