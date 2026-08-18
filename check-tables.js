const pool = require('./config/db');

async function checkTables() {
  try {
    const [tables] = await pool.query('SHOW TABLES');
    console.log('Tables in database:', tables);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkTables();