const fs = require('fs');
const pool = require('./config/db');

async function runSchema() {
  const sql = fs.readFileSync('./schema.sql', 'utf8');
  const statements = sql.split(';').filter(s => s.trim());
  try {
    for (const stmt of statements) {
      await pool.query(stmt);
    }
    console.log('✅ Schema created successfully!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

runSchema();