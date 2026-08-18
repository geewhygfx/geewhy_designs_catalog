// HOW TO USE THIS FILE:
// 1. Put your product photo(s) in the public/products folder.
// 2. Edit the values below (name, category, price, etc).
// 3. In your terminal, run: node add-product.js
// 4. Then run: git add . , git commit -m "add product", git push
//    (this uploads the photo to GitHub so Render/your live site can see it)
//
// You can reuse this file for every new product — just change the values
// below and run it again each time.

require('dotenv').config();
const mysql = require('mysql2/promise');

// ---------- EDIT THESE VALUES FOR YOUR PRODUCT ----------
const product = {
  name: 'Emirate Jallabiya',
  category: 'Jallabiya',
  price: 20000,
  sizes: '58,60,62',
  stock_status: 'in_stock', // options: in_stock, made_to_order, low_stock, sold_out
  description: 'Fabric, fit, and details customers ask about.',

  // List the photo filenames you placed in public/products/
  // The first one becomes the cover photo shown on the catalog grid.
  images: ['ashjallabhq1.jpg', 'ashjallabhq.jpg']
};
// ----------------------------------------------------------

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
  console.log('Connected. Adding product...');

  const imagePaths = product.images.map(f => '/products/' + f);
  const coverImage = imagePaths.length ? imagePaths[0] : '';

  const [result] = await conn.query(
    `INSERT INTO products (name, category, price, sizes, stock_status, image_path, description)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [product.name, product.category, product.price, product.sizes, product.stock_status, coverImage, product.description]
  );
  const productId = result.insertId;

  for (let i = 0; i < imagePaths.length; i++) {
    await conn.query(
      'INSERT INTO product_images (product_id, image_path, sort_order) VALUES (?, ?, ?)',
      [productId, imagePaths[i], i]
    );
  }

  console.log(`✅ Added "${product.name}" with ${imagePaths.length} photo(s).`);
  await conn.end();
}

run().catch(err => {
  console.error('❌ Error:', err.message);
});