const pool = require('./config/db');

async function checkSchema() {
  try {
    const [productsCols] = await pool.query('DESCRIBE products');
    const [imagesCols] = await pool.query('DESCRIBE product_images');
    console.log('products columns:', productsCols.map(c => c.Field));
    console.log('product_images columns:', imagesCols.map(c => c.Field));
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkSchema();