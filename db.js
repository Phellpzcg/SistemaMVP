require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString });

async function testConnection() {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    console.log('Conectado ao banco de dados. Hora atual:', rows[0].now);
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  testConnection();
}

module.exports = pool;
