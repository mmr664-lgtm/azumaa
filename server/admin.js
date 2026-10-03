const express = require('express');
const router = express.Router();
const db = require('./db');

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await db.query('SELECT * FROM admin WHERE username = $1 AND password = $2', [username, password]);
    if (rows.length > 0) {
      return res.json({ success: true, message: "Login Successful", admin: { id: rows[0].id, username: rows[0].username } });
    } else {
      return res.json({ success: false, message: "Invalid Admin Username or Password" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin Stats
router.get('/stats', async (req, res) => {
  try {
    const ordersCount = await db.query('SELECT COUNT(*) FROM orders');
    const usersCount = await db.query('SELECT COUNT(*) FROM "user"');
    const ridersCount = await db.query('SELECT COUNT(*) FROM rider');
    const productsCount = await db.query('SELECT COUNT(*) FROM product');
    const revenueSum = await db.query('SELECT SUM(total) FROM orders WHERE status = $1', ['Completed']);

    res.json({
      success: true,
      stats: {
        totalOrders: ordersCount.rows[0].count,
        totalUsers: usersCount.rows[0].count,
        totalRiders: ridersCount.rows[0].count,
        totalProducts: productsCount.rows[0].count,
        totalRevenue: revenueSum.rows[0].sum || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Orders List
router.get('/orders', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM orders ORDER BY id DESC LIMIT 50');
    res.json({ success: true, orders: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update Order Status / Assign Rider
router.post('/orders/update', async (req, res) => {
  const { id, status, rid } = req.body;
  try {
    await db.query('UPDATE orders SET status = COALESCE($1, status), rid = COALESCE($2, rid) WHERE id = $3', [status, rid, id]);
    res.json({ success: true, message: "Order updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Products List
router.get('/products', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM product ORDER BY id DESC');
    res.json({ success: true, products: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add Product
router.post('/products/add', async (req, res) => {
  const { pname, sname, cid, sid, psdesc, pgms, pprice, stock, pimg, discount } = req.body;
  try {
    const date = new Date().toISOString();
    await db.query(
      `INSERT INTO product (pname, sname, cid, sid, psdesc, pgms, pprice, fprice, status, stock, pimg, date, discount, popular, mqty)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $7, 1, $8, $9, $10, $11, 1, 5)`,
      [pname, sname || 'Azumaa Store', cid, sid, psdesc || '', pgms, pprice, stock || 100, pimg || 'website/thump.png', date, discount || 0]
    );
    res.json({ success: true, message: "Product added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Categories List
router.get('/categories', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM category ORDER BY id ASC');
    res.json({ success: true, categories: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Riders List
router.get('/riders', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM rider ORDER BY id DESC');
    res.json({ success: true, riders: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add Rider
router.post('/riders/add', async (req, res) => {
  const { name, mobile, email, aid, address, password } = req.body;
  try {
    await db.query(
      'INSERT INTO rider (name, mobile, email, aid, address, status, password, reject, accept, complete, a_status) VALUES ($1, $2, $3, $4, $5, 1, $6, 0, 0, 0, 1)',
      [name, mobile, email, aid || 1, address || '', password]
    );
    res.json({ success: true, message: "Rider added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// System Settings
router.get('/settings', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM setting LIMIT 1');
    res.json({ success: true, settings: rows[0] || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
