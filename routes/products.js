const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all products (public catalog)
router.get('/', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    const [images] = await db.query('SELECT * FROM product_images ORDER BY sort_order ASC, id ASC');

    const imagesByProduct = {};
    for (const img of images) {
      if (!imagesByProduct[img.product_id]) imagesByProduct[img.product_id] = [];
      imagesByProduct[img.product_id].push(img.image_path);
    }

    const result = products.map(p => ({
      ...p,
      images: imagesByProduct[p.id] || (p.image_path ? [p.image_path] : [])
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load products' });
  }
});

module.exports = router;
