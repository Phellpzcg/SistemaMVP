const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $1',
      [login]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      is_active: user.is_active,
      role: user.role,
    };

    res.json({ message: 'Logged in successfully' });
  } catch (err) {
    console.error(err);
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
