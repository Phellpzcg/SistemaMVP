const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');

function logErr(err) { const msg = (err.message || '').split('\\n')[0]; console.error(err.code || 'ERR', msg); }

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR name = $1',
      [login]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: 'Acesso não liberado' });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    };

    res.json({ message: 'Logged in successfully' });
  } catch (err) {
    logErr(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
