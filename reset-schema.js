// Run this once with: node reset-schema.js
// It rebuilds the products and product_images tables with the correct columns.
// Safe to run even if the tables are empty or broken — it drops and recreates them.

require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  };
  if (process.env.DB_SSL === 'true') {
    config.ssl = { rejectUnauthorized: true };
  }

  const conn = await mysql.createConnection(config);
  console.log('Connected. Rebuilding tables...');

  await conn.query('DROP TABLE IF EXISTS product_images');
  await conn.query('DROP TABLE IF EXISTS products');

  await conn.query(`
    CREATE TABLE products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      category VARCHAR(100) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      sizes VARCHAR(100) DEFAULT '',
      stock_status ENUM('in_stock', 'made_to_order', 'low_stock', 'sold_out') DEFAULT 'in_stock',
      image_path VARCHAR(255) DEFAULT '',
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await conn.query(`
    CREATE TABLE product_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      image_path VARCHAR(255) NOT NULL,
      sort_order INT DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Tables rebuilt successfully with the correct columns.');
  await conn.end();
}

run().catch(err => {
  console.error('❌ Error:', err.message);
});