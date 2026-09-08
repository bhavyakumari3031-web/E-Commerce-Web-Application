const db = require("../config/db");

async function getProducts(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load products." });
  }
}

async function getProduct(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Product not found." });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Could not load product." });
  }
}

async function createProduct(req, res) {
  try {
    const { name, description, price, category, image_url, stock } = req.body;
    if (!name || price === undefined || !category || stock === undefined) {
      return res.status(400).json({ message: "Name, price, category and stock are required." });
    }

    const [result] = await db.query(
      "INSERT INTO products (name, description, price, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)",
      [name.trim(), description || "", Number(price), category, image_url || "", Number(stock)]
    );
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create product." });
  }
}

async function updateProduct(req, res) {
  try {
    const { name, description, price, category, image_url, stock } = req.body;
    const [result] = await db.query(
      `UPDATE products
       SET name=?, description=?, price=?, category=?, image_url=?, stock=?
       WHERE id=?`,
      [name, description || "", Number(price), category, image_url || "", Number(stock), req.params.id]
    );

    if (!result.affectedRows) return res.status(404).json({ message: "Product not found." });
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update product." });
  }
}

async function deleteProduct(req, res) {
  try {
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product deleted." });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ message: "This product is linked to an order and cannot be deleted." });
    }
    console.error(error);
    res.status(500).json({ message: "Could not delete product." });
  }
}

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
