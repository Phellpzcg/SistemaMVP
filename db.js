require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({
  connectionString,
  ...(process.env.NODE_ENV !== 'development'
    ? { ssl: { rejectUnauthorized: false } }
    : {}),
});

module.exports = pool;
