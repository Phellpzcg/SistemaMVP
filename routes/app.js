const express = require('express');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Simple protected route to verify session access
router.get('/', requireAuth, (req, res) => {
  res.json({ message: 'App route accessible' });
});

module.exports = router;
