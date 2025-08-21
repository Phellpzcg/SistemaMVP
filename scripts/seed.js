const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

async function run() {
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

  try {
    const migrationPath = path.join(__dirname, '..', 'migrations', '001_init.sql');
    const migration = fs.readFileSync(migrationPath, 'utf8');
    const { rows } = await pool.query("SELECT to_regclass('public.users') AS exists");
    await pool.query(migration);
    console.log(rows[0].exists ? 'migration já ok' : 'migration aplicada');

    const passwordHash = await bcrypt.hash('Admin@123', 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ['Admin', 'admin@demo.com', passwordHash, 'ADMIN', true]
    );

    if (result.rowCount === 0) {
      console.log('admin já existia');
    } else {
      console.log('admin criado');
    }

    console.log('seed concluído');
  } catch (err) {
    const msg = err.message.split('\n')[0];
    console.error('Error during seeding:', msg);
  } finally {
    await pool.end();
  }
}

run();
