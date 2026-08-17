# Geewhy Designs — Catalog Site

## What this is
- A public catalog page (`public/index.html`) that lists your products
- An admin page (`public/admin.html`) where you add/edit/delete products — no code editing needed
- A "WhatsApp inquire" button on every product that opens WhatsApp with the item name already filled in

## First-time setup

1. **Install dependencies**
   ```
   npm install
   ```

2. **Create the database**
   Open a terminal where MySQL is running and run:
   ```
   mysql -u root -p < schema.sql
   ```
   (Type your MySQL password when asked. This creates the `geewhy_catalog` database and a `products` table with two sample products.)

3. **Set up your environment file**
   Copy `.env.example` to a new file named `.env`, then fill in:
   - `DB_PASSWORD` — your MySQL password
   - `ADMIN_PASSWORD` — a password you'll type to get into the admin page
   - `WHATSAPP_NUMBER` — already set to your number

4. **Start the server**
   ```
   npm start
   ```
   Then open:
   - `http://localhost:3000` — the public catalog
   - `http://localhost:3000/admin.html` — your admin dashboard

## Adding products
Go to `/admin.html`, type your admin password, fill in the form (name, category, price, sizes, a photo), and submit. It appears on the catalog instantly.

## Next steps (when you're ready)
- Put this online (Render, Railway, or a VPS) so customers can reach it from anywhere
- Point your domain name at it
- Add categories/filtering if your catalog grows large
