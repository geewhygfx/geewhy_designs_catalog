-- Run this once to set up the database.
-- In your terminal: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS geewhy_catalog;
USE geewhy_catalog;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sizes VARCHAR(100) DEFAULT '',
  stock_status ENUM('in_stock', 'made_to_order', 'low_stock', 'sold_out') DEFAULT 'in_stock',
  image_path VARCHAR(255) DEFAULT '',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- A couple of sample rows so the site isn't empty on first run.
-- Delete these from the admin page whenever you like.
INSERT INTO products (name, category, price, sizes, stock_status, description)
VALUES
  ('The Amber Agbada', 'Agbada', 85000.00, 'M, L, XL', 'in_stock', 'Cotton blend agbada in warm amber.'),
  ('Sand Dune Kaftan', 'Kaftan', 48000.00, 'S, M, L', 'in_stock', 'Lightweight cotton kaftan.');
