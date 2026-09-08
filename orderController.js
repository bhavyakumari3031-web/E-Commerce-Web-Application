const db = require("../config/db");

async function createOrder(req, res) {
  const connection = await db.getConnection();

  try {
    const { items, address, phone } = req.body;
    if (!Array.isArray(items) || items.length === 0 || !address || !phone) {
      connection.release();
      return res.status(400).json({ message: "Cart items, address and phone are required." });
    }

    await connection.beginTransaction();

    const productIds = items.map(item => Number(item.product_id));
    const placeholders = productIds.map(() => "?").join(",");
    const [products] = await connection.query(
      `SELECT * FROM products WHERE id IN (${placeholders}) FOR UPDATE`,
      productIds
    );

    const byId = new Map(products.map(p => [p.id, p]));
    let total = 0;
    const normalizedItems = [];

    for (const item of items) {
      const product = byId.get(Number(item.product_id));
      const quantity = Number(item.quantity);

      if (!product) throw new Error(`Product ${item.product_id} not found.`);
      if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Invalid quantity.");
      if (product.stock < quantity) throw new Error(`${product.name} has only ${product.stock} item(s) left.`);

      total += Number(product.price) * quantity;
      normalizedItems.push({ product, quantity });
    }

    const [orderResult] = await connection.query(
      "INSERT INTO orders (user_id, total_amount, address, phone, status) VALUES (?, ?, ?, ?, 'Processing')",
      [req.user.id, total.toFixed(2), address.trim(), phone.trim()]
    );

    for (const item of normalizedItems) {
      await connection.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderResult.insertId, item.product.id, item.quantity, item.product.price]
      );
      await connection.query(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.product.id]
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Order placed successfully.", orderId: orderResult.insertId });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(400).json({ message: error.message || "Could not place order." });
  } finally {
    connection.release();
  }
}

async function getMyOrders(req, res) {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );

    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name, p.image_url
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load orders." });
  }
}

async function getAllOrders(req, res) {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name AS customer_name, u.email AS customer_email
       FROM orders o
       JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    );
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load all orders." });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const allowed = ["Processing", "Shipped", "Delivered", "Cancelled"];
    const { status } = req.body;
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    const [result] = await db.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: "Order not found." });

    res.json({ message: "Order status updated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update order." });
  }
}

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
