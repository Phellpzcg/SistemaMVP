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

  const pool = new Pool({ connectionString });

  try {
    const migrationPath = path.join(__dirname, '..', 'migrations', '001_init.sql');
    const migration = fs.readFileSync(migrationPath, 'utf8');
    await pool.query(migration);

    const passwordHash = await bcrypt.hash('1234', 10);
    await pool.query(
      `INSERT INTO users (email, username, password, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      ['filipeoliveira@example.com', 'filipeoliveira', passwordHash, 'admin']
    );

    console.log('Seeding completed successfully.');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await pool.end();
  }
}

run();
