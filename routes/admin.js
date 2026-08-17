const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
require('dotenv').config();

// Where uploaded product photos are saved
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Simple password check. The admin page sends this in a header on every request.
function checkPassword(req, res, next) {
  const password = req.headers['x-admin-password'];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Wrong password' });
  }
  next();
}

// Log in: just checks the password is correct
router.post('/login', (req, res) => {
  if (req.body.password === process.env.ADMIN_PASSWORD) {
    return res.json({ ok: true });
  }
  res.status(401).json({ ok: false });
});

// Get all photos for one product (with their IDs, so they can be deleted individually)
router.get('/products/:id/images', checkPassword, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, image_path FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load photos' });
  }
});

// Add a new product (with up to 6 photos)
router.post('/products', checkPassword, upload.array('images', 6), async (req, res) => {
  try {
    const { name, category, price, sizes, stock_status, description } = req.body;
    const files = req.files || [];
    const firstImage = files.length ? '/uploads/' + files[0].filename : '';

    const [result] = await db.query(
      `INSERT INTO products (name, category, price, sizes, stock_status, image_path, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, category, price, sizes, stock_status, firstImage, description]
    );
    const productId = result.insertId;

    for (let i = 0; i < files.length; i++) {
      await db.query(
        'INSERT INTO product_images (product_id, image_path, sort_order) VALUES (?, ?, ?)',
        [productId, '/uploads/' + files[i].filename, i]
      );
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not add product' });
  }
});

// Update an existing product's details, and add any new photos uploaded
router.put('/products/:id', checkPassword, upload.array('images', 6), async (req, res) => {
  try {
    const { name, category, price, sizes, stock_status, description } = req.body;
    const files = req.files || [];

    await db.query(
      `UPDATE products SET name=?, category=?, price=?, sizes=?, stock_status=?, description=? WHERE id=?`,
      [name, category, price, sizes, stock_status, description, req.params.id]
    );

    if (files.length) {
      const [existing] = await db.query(
        'SELECT COUNT(*) as count FROM product_images WHERE product_id = ?',
        [req.params.id]
      );
      let nextOrder = existing[0].count;

      for (const file of files) {
        await db.query(
          'INSERT INTO product_images (product_id, image_path, sort_order) VALUES (?, ?, ?)',
          [req.params.id, '/uploads/' + file.filename, nextOrder]
        );
        nextOrder++;
      }

      // If this product had no cover photo yet, use the first newly uploaded one
      const [product] = await db.query('SELECT image_path FROM products WHERE id = ?', [req.params.id]);
      if (product.length && !product[0].image_path) {
        await db.query('UPDATE products SET image_path = ? WHERE id = ?', ['/uploads/' + files[0].filename, req.params.id]);
      }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update product' });
  }
});

// Delete a single photo from a product
router.delete('/product-images/:imageId', checkPassword, async (req, res) => {
  try {
    await db.query('DELETE FROM product_images WHERE id = ?', [req.params.imageId]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not remove photo' });
  }
});

// Delete a product
router.delete('/products/:id', checkPassword, async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete product' });
  }
});

module.exports = router;
