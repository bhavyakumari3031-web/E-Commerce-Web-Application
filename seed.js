require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./config/db");

const products = [
  ["Aurora Hoodie", "Soft everyday hoodie with a clean premium finish.", 1299, "Fashion", "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80", 18],
  ["Urban Sneakers", "Lightweight sneakers designed for daily comfort.", 1899, "Footwear", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", 12],
  ["Minimal Watch", "Classic minimalist dial with a modern strap.", 999, "Accessories", "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80", 15],
  ["Everyday Backpack", "Compact laptop-friendly backpack for college and work.", 1499, "Bags", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80", 20],
  ["Classic Sunglasses", "UV-protection sunglasses with a timeless frame.", 799, "Accessories", "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80", 25],
  ["Essential T-Shirt", "Comfort-fit cotton T-shirt for everyday styling.", 599, "Fashion", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80", 30]
];

async function seed() {
  try {
    const adminHash = await bcrypt.hash("Admin@123", 10);
    const userHash = await bcrypt.hash("User@123", 10);

    await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, 'admin')
       ON DUPLICATE KEY UPDATE name=VALUES(name), password_hash=VALUES(password_hash), role='admin'`,
      ["Store Admin", "admin@shop.com", adminHash]
    );

    await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, 'user')
       ON DUPLICATE KEY UPDATE name=VALUES(name), password_hash=VALUES(password_hash), role='user'`,
      ["Demo User", "user@shop.com", userHash]
    );

    const [countRows] = await db.query("SELECT COUNT(*) AS count FROM products");
    if (countRows[0].count === 0) {
      await db.query(
        "INSERT INTO products (name, description, price, category, image_url, stock) VALUES ?",
        [products]
      );
    }

    console.log("Seed completed.");
    console.log("Admin: admin@shop.com / Admin@123");
    console.log("User:  user@shop.com / User@123");
  } catch (err) {
    console.error(err);
  } finally {
    await db.end();
  }
}

seed();
