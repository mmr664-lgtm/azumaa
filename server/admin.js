const express = require('express');
const router = express.Router();
const db = require('./db');

// ----------------------------------------------------
// 1. ADMIN AUTH & PROFILE
// ----------------------------------------------------

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Seed/update default admin if logging in
    if (username === 'admin' && (password === '1234567aA' || password === 'admin@123')) {
      await db.query(`
        INSERT INTO admin (id, username, password) 
        VALUES (1, 'admin', '1234567aA')
        ON CONFLICT (id) DO UPDATE SET username = 'admin', password = '1234567aA';
      `).catch(() => {});
    }

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

// Update Profile (Username & Password)
router.post('/profile', async (req, res) => {
  const { id, username, password } = req.body;
  try {
    await db.query('UPDATE admin SET username = $1, password = $2 WHERE id = $3', [username, password, id || 1]);
    res.json({ success: true, message: "Admin Profile Updated Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// 2. DASHBOARD STATS (14 STAT CARDS)
// ----------------------------------------------------
router.get('/stats', async (req, res) => {
  try {
    const catCount = await db.query('SELECT COUNT(*) FROM category').catch(() => ({ rows: [{ count: 0 }] }));
    const subcatCount = await db.query('SELECT COUNT(*) FROM subcategory').catch(() => ({ rows: [{ count: 0 }] }));
    const prodCount = await db.query('SELECT COUNT(*) FROM product').catch(() => ({ rows: [{ count: 0 }] }));
    const areaCount = await db.query('SELECT COUNT(*) FROM area_db').catch(() => ({ rows: [{ count: 0 }] }));
    const timeslotCount = await db.query('SELECT COUNT(*) FROM timeslot').catch(() => ({ rows: [{ count: 0 }] }));
    const bannerCount = await db.query('SELECT COUNT(*) FROM banner').catch(() => ({ rows: [{ count: 0 }] }));
    const custCount = await db.query('SELECT COUNT(*) FROM "user"').catch(() => ({ rows: [{ count: 0 }] }));
    const pendingOrdersCount = await db.query("SELECT COUNT(*) FROM orders WHERE status = 'Pending'").catch(() => ({ rows: [{ count: 0 }] }));
    const completedOrdersCount = await db.query("SELECT COUNT(*) FROM orders WHERE status = 'Completed'").catch(() => ({ rows: [{ count: 0 }] }));
    const cancelledOrdersCount = await db.query("SELECT COUNT(*) FROM orders WHERE status = 'Cancelled'").catch(() => ({ rows: [{ count: 0 }] }));
    const ratingCount = await db.query('SELECT COUNT(*) FROM rate_order').catch(() => ({ rows: [{ count: 0 }] }));
    const feedbackCount = await db.query('SELECT COUNT(*) FROM feedback').catch(() => ({ rows: [{ count: 0 }] }));
    const salesSum = await db.query("SELECT SUM(total) FROM orders WHERE status = 'Completed'").catch(() => ({ rows: [{ sum: 0 }] }));
    const riderCount = await db.query('SELECT COUNT(*) FROM rider').catch(() => ({ rows: [{ count: 0 }] }));

    res.json({
      success: true,
      stats: {
        totalCategories: parseInt(catCount.rows[0].count || 0),
        totalSubCategories: parseInt(subcatCount.rows[0].count || 0),
        totalProducts: parseInt(prodCount.rows[0].count || 0),
        totalAreas: parseInt(areaCount.rows[0].count || 0),
        totalTimeslots: parseInt(timeslotCount.rows[0].count || 0),
        totalBanners: parseInt(bannerCount.rows[0].count || 0),
        totalCustomers: parseInt(custCount.rows[0].count || 0),
        pendingOrders: parseInt(pendingOrdersCount.rows[0].count || 0),
        completedOrders: parseInt(completedOrdersCount.rows[0].count || 0),
        cancelledOrders: parseInt(cancelledOrdersCount.rows[0].count || 0),
        customerRatings: parseInt(ratingCount.rows[0].count || 0),
        totalFeedbacks: parseInt(feedbackCount.rows[0].count || 0),
        totalSales: parseFloat(salesSum.rows[0].sum || 0),
        totalRiders: parseInt(riderCount.rows[0].count || 0)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// 3. CUSTOMER MANAGEMENT (إدارة العملاء)
// ----------------------------------------------------

// List Customers
router.get('/customers', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM "user" ORDER BY id DESC');
    res.json({ success: true, customers: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Toggle Customer Active/Deactive
router.post('/customers/status', async (req, res) => {
  const { id, status } = req.body;
  try {
    await db.query('UPDATE "user" SET status = $1 WHERE id = $2', [status, id]);
    res.json({ success: true, message: "Customer status updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete Customer
router.post('/customers/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await db.query('DELETE FROM "user" WHERE id = $1', [id]);
    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add Wallet Balance to Customer
router.post('/customers/add-balance', async (req, res) => {
  const { id, amount } = req.body;
  try {
    const addAmt = parseFloat(amount || 0);
    await db.query('UPDATE "user" SET wallet = COALESCE(wallet, 0) + $1 WHERE id = $2', [addAmt, id]);
    res.json({ success: true, message: "Wallet balance added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// View Customer Addresses
router.get('/customers/addresses', async (req, res) => {
  const { uid } = req.query;
  try {
    const { rows } = await db.query('SELECT * FROM address WHERE uid = $1 ORDER BY id DESC', [uid]);
    res.json({ success: true, addresses: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// 4. ORDER MANAGEMENT (إدارة الطلبات)
// ----------------------------------------------------

// List Orders (Pending / Completed / All)
router.get('/orders', async (req, res) => {
  const { status } = req.query;
  try {
    let sql = 'SELECT o.*, r.name as rider_name FROM orders o LEFT JOIN rider r ON o.rid = r.id';
    const params = [];
    if (status) {
      params.push(status);
      sql += ' WHERE o.status = $1';
    }
    sql += ' ORDER BY o.id DESC LIMIT 100';

    const { rows } = await db.query(sql, params);
    res.json({ success: true, orders: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Assign / Reassign Rider to Order
router.post('/orders/assign', async (req, res) => {
  const { id, rid } = req.body;
  try {
    await db.query('UPDATE orders SET rid = $1, a_status = 1 WHERE id = $2', [rid, id]);
    res.json({ success: true, message: "Order assigned to delivery boy" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete Order
router.post('/orders/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await db.query('DELETE FROM orders WHERE id = $1', [id]);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// 5. CATALOG MANAGEMENT (الأقسام والمنتجات)
// ----------------------------------------------------

// Categories
router.get('/categories', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT c.*, COUNT(s.id) as subcat_count 
      FROM category c 
      LEFT JOIN subcategory s ON c.id = s.cat_id 
      GROUP BY c.id 
      ORDER BY c.id ASC
    `);
    res.json({ success: true, categories: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/categories/add', async (req, res) => {
  const { catname, catimg } = req.body;
  try {
    await db.query('INSERT INTO category (catname, catimg) VALUES ($1, $2)', [catname, catimg || 'website/thump.png']);
    res.json({ success: true, message: "Category added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/categories/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await db.query('DELETE FROM category WHERE id = $1', [id]);
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Sub Categories
router.get('/subcategories', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT s.*, c.catname 
      FROM subcategory s 
      LEFT JOIN category c ON s.cat_id = c.id 
      ORDER BY s.id ASC
    `);
    res.json({ success: true, subcategories: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/subcategories/add', async (req, res) => {
  const { cat_id, name, img } = req.body;
  try {
    await db.query('INSERT INTO subcategory (cat_id, name, img) VALUES ($1, $2, $3)', [cat_id, name, img || 'website/thump.png']);
    res.json({ success: true, message: "SubCategory added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/subcategories/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await db.query('DELETE FROM subcategory WHERE id = $1', [id]);
    res.json({ success: true, message: "SubCategory deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Products
router.get('/products', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT p.*, c.catname, s.name as subcat_name 
      FROM product p 
      LEFT JOIN category c ON p.cid = c.id 
      LEFT JOIN subcategory s ON p.sid = s.id 
      ORDER BY p.id DESC
    `);
    res.json({ success: true, products: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/products/add', async (req, res) => {
  const { pname, sname, cid, sid, psdesc, pgms, pprice, stock, pimg, prel, discount } = req.body;
  try {
    const date = new Date().toISOString();
    await db.query(
      `INSERT INTO product (pname, sname, cid, sid, psdesc, pgms, pprice, fprice, status, stock, pimg, prel, date, discount, popular, mqty)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $7, 1, $8, $9, $10, $11, $12, 1, 5)`,
      [pname, sname || 'Azumaa Store', cid, sid, psdesc || '', pgms, pprice, stock || 100, pimg || 'website/thump.png', prel || '', date, discount || 0]
    );
    res.json({ success: true, message: "Product added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/products/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await db.query('DELETE FROM product WHERE id = $1', [id]);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// 6. DELIVERY BOY MANAGEMENT (إدارة السائقين)
// ----------------------------------------------------

router.get('/riders', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT r.*, a.name as area_name FROM rider r LEFT JOIN area_db a ON r.aid = a.id ORDER BY r.id DESC');
    res.json({ success: true, riders: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/riders/add', async (req, res) => {
  const { name, mobile, email, aid, address, password, status } = req.body;
  try {
    await db.query(
      'INSERT INTO rider (name, mobile, email, aid, address, status, password, reject, accept, complete, a_status) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0, 0, 1)',
      [name, mobile, email, aid || 1, address || '', status || 1, password]
    );
    res.json({ success: true, message: "Delivery Boy added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/riders/status', async (req, res) => {
  const { id, status } = req.body;
  try {
    await db.query('UPDATE rider SET status = $1 WHERE id = $2', [status, id]);
    res.json({ success: true, message: "Delivery Boy status updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/riders/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await db.query('DELETE FROM rider WHERE id = $1', [id]);
    res.json({ success: true, message: "Delivery Boy deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// 7. AREA & TIMESLOT MANAGEMENT
// ----------------------------------------------------

// Area
router.get('/areas', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM area_db ORDER BY id DESC');
    res.json({ success: true, areas: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/areas/add', async (req, res) => {
  const { name, dcharge, status } = req.body;
  try {
    await db.query('INSERT INTO area_db (name, dcharge, status) VALUES ($1, $2, $3)', [name, dcharge, status || 'Active']);
    res.json({ success: true, message: "Area added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/areas/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await db.query('DELETE FROM area_db WHERE id = $1', [id]);
    res.json({ success: true, message: "Area deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Timeslot
router.get('/timeslots', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM timeslot ORDER BY id ASC');
    res.json({ success: true, timeslots: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/timeslots/add', async (req, res) => {
  const { min_time, max_time } = req.body;
  try {
    await db.query('INSERT INTO timeslot (min_time, max_time) VALUES ($1, $2)', [min_time, max_time]);
    res.json({ success: true, message: "Timeslot added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/timeslots/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await db.query('DELETE FROM timeslot WHERE id = $1', [id]);
    res.json({ success: true, message: "Timeslot deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// 8. MARKETING (Banners, Coupons, Home Section)
// ----------------------------------------------------

// Banners
router.get('/banners', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT b.*, c.catname FROM banner b LEFT JOIN category c ON b.cid = c.id ORDER BY b.id DESC');
    res.json({ success: true, banners: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/banners/add', async (req, res) => {
  const { bimg, cid } = req.body;
  try {
    await db.query('INSERT INTO banner (bimg, cid) VALUES ($1, $2)', [bimg, cid || 0]);
    res.json({ success: true, message: "Banner added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/banners/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await db.query('DELETE FROM banner WHERE id = $1', [id]);
    res.json({ success: true, message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Coupons
router.get('/coupons', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM coupon ORDER BY id DESC');
    res.json({ success: true, coupons: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/coupons/add', async (req, res) => {
  const { c_img, cdate, c_code, c_title, status, min_amt, c_value, c_desc } = req.body;
  try {
    await db.query(
      'INSERT INTO coupon (c_img, cdate, c_code, c_title, status, min_amt, c_value, c_desc) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [c_img || 'website/thump.png', cdate, c_code, c_title, status || 'Active', min_amt || 0, c_value, c_desc || '']
    );
    res.json({ success: true, message: "Coupon added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/coupons/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await db.query('DELETE FROM coupon WHERE id = $1', [id]);
    res.json({ success: true, message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Home Sections
router.get('/home-sections', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT h.*, c.catname, s.name as subcat_name FROM home h LEFT JOIN category c ON h.cid = c.id LEFT JOIN subcategory s ON h.sid = s.id ORDER BY h.id ASC');
    res.json({ success: true, sections: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/home-sections/add', async (req, res) => {
  const { title, cid, sid, status } = req.body;
  try {
    await db.query('INSERT INTO home (title, cid, sid, status) VALUES ($1, $2, $3, $4)', [title, cid, sid, status || 1]);
    res.json({ success: true, message: "Home Section added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/home-sections/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await db.query('DELETE FROM home WHERE id = $1', [id]);
    res.json({ success: true, message: "Home Section deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// 9. NOTIFICATIONS & RATINGS
// ----------------------------------------------------

router.get('/notifications', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM noti ORDER BY id DESC');
    res.json({ success: true, notifications: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/notifications/send', async (req, res) => {
  const { title, msg, img } = req.body;
  try {
    const date = new Date().toISOString();
    await db.query('INSERT INTO noti (title, msg, img, date) VALUES ($1, $2, $3, $4)', [title, msg, img || '', date]);
    res.json({ success: true, message: "Push Notification Sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/ratings', async (req, res) => {
  try {
    const ratings = await db.query('SELECT r.*, u.name as user_name FROM rate_order r LEFT JOIN "user" u ON r.uid = u.id ORDER BY r.id DESC').catch(() => ({ rows: [] }));
    const feedbacks = await db.query('SELECT f.*, u.name as user_name FROM feedback f LEFT JOIN "user" u ON f.uid = u.id ORDER BY f.id DESC').catch(() => ({ rows: [] }));
    res.json({ success: true, ratings: ratings.rows, feedbacks: feedbacks.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// 10. SYSTEM SETTINGS, COUNTRY CODES & PAYMENT GATEWAYS
// ----------------------------------------------------

// Country Codes
router.get('/country-codes', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM country_code ORDER BY id ASC');
    res.json({ success: true, codes: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/country-codes/add', async (req, res) => {
  const { ccode, status } = req.body;
  try {
    await db.query('INSERT INTO country_code (ccode, status) VALUES ($1, $2)', [ccode, status || 1]);
    res.json({ success: true, message: "Country Code added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/country-codes/status', async (req, res) => {
  const { id, status } = req.body;
  try {
    await db.query('UPDATE country_code SET status = $1 WHERE id = $2', [status, id]);
    res.json({ success: true, message: "Country Code status updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Payment Gateways
router.get('/payment-gateways', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM payment_list ORDER BY id ASC');
    res.json({ success: true, gateways: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/payment-gateways/update', async (req, res) => {
  const { id, title, cred_value, status } = req.body;
  try {
    await db.query('UPDATE payment_list SET cred_title = COALESCE($1, cred_title), cred_value = COALESCE($2, cred_value), status = COALESCE($3, status) WHERE id = $4', [title, cred_value, status, id]);
    res.json({ success: true, message: "Payment Gateway updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// General System Settings
router.get('/settings', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM setting LIMIT 1');
    res.json({ success: true, settings: rows[0] || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/settings/update', async (req, res) => {
  const { currency, o_min, tax, logo, title, timezone, user_onesignal_app_id, user_onesignal_rest_key, rider_onesignal_app_id, rider_onesignal_rest_key, privacy_policy, about_us, contact_us, terms } = req.body;
  try {
    const check = await db.query('SELECT id FROM setting LIMIT 1');
    if (check.rows.length === 0) {
      await db.query(
        `INSERT INTO setting (currency, o_min, tax, logo, title, timezone, one_key, one_hash, r_key, r_hash, privacy_policy, about_us, contact_us, terms)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [currency || '$', o_min || 10, tax || 5, logo || 'website/thump.png', title || 'Azumaa Delivery', timezone || 'Asia/Riyadh', user_onesignal_app_id || '', user_onesignal_rest_key || '', rider_onesignal_app_id || '', rider_onesignal_rest_key || '', privacy_policy || '', about_us || '', contact_us || '', terms || '']
      );
    } else {
      await db.query(
        `UPDATE setting SET currency = $1, o_min = $2, tax = $3, logo = $4, title = $5, timezone = $6, one_key = $7, one_hash = $8, r_key = $9, r_hash = $10, privacy_policy = $11, about_us = $12, contact_us = $13, terms = $14 WHERE id = $15`,
        [currency, o_min, tax, logo, title, timezone, user_onesignal_app_id, user_onesignal_rest_key, rider_onesignal_app_id, rider_onesignal_rest_key, privacy_policy, about_us, contact_us, terms, check.rows[0].id]
      );
    }
    res.json({ success: true, message: "General Settings Updated Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
