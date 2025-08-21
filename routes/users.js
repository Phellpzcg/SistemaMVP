const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const { requireRole } = require('../middleware/auth');

function logErr(err) { const msg = (err.message || '').split('\n')[0]; console.error(err.code || 'ERR', msg); }

const router = express.Router();

// all routes here require ADMIN role
router.use(requireRole('ADMIN'));

// List all users
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, email, name, role, is_active FROM users'
    );
    res.json(rows);
  } catch (err) {
    logErr(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, email, name, role, is_active FROM users WHERE id = $1',
      [req.params.id]
    );
    const user = rows[0];
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (err) {
    logErr(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create user
router.post('/', async (req, res) => {
  const { name, email, password, role = 'CLIENT', is_active = false } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, is_active) VALUES ($1,$2,$3,$4,$5) RETURNING id, email, name, role, is_active',
      [name, email, passwordHash, role, is_active]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    logErr(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, is_active } = req.body;
  try {
    const fields = [];
    const values = [];
    let idx = 1;
    if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name); }
    if (email !== undefined) { fields.push(`email = $${idx++}`); values.push(email); }
    if (password !== undefined) {
      const hash = await bcrypt.hash(password, 10);
      fields.push(`password_hash = $${idx++}`); values.push(hash);
    }
    if (role !== undefined) { fields.push(`role = $${idx++}`); values.push(role); }
    if (typeof is_active === 'boolean') { fields.push(`is_active = $${idx++}`); values.push(is_active); }
    if (!fields.length) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    values.push(id);
    const { rows } = await pool.query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING id, email, name, role, is_active`,
      values
    );
    const user = rows[0];
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (err) {
    logErr(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [
      req.params.id,
    ]);
    if (rowCount === 0) return res.status(404).json({ message: 'Not found' });
    res.status(204).end();
  } catch (err) {
    logErr(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
