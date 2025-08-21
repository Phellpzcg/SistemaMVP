const express = require('express');
const { requireAuth } = require('./auth');

const router = express.Router();

router.get('/api/app/hello', requireAuth, (req, res) => {
  res.json({ message: 'Hello from app!' });
});

module.exports = router;
