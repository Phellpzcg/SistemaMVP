const express = require('express');
const pool = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// List all users - only accessible to authenticated admins
router.get('/', requireRole('ADMIN'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, email, name, role, is_active FROM users'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
