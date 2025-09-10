const express = require('express');

// Chat route deprecated/removed in this MVP. This file is retained only to avoid broken imports.
// The server does NOT mount /chat. Discovery is via catalog only.
const router = express.Router();

router.all('*', (req, res) => {
  return res.status(404).json({ error: 'Not Implemented: chat is removed in this MVP' });
});

module.exports = router;
