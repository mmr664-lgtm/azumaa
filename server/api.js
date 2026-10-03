const express = require('express');
const router = express.Router();
const db = require('./db');

// Helper to parse price strings like "100$;200" and "1kg$;2kg" into array
function parseProductPrices(pgms, pprice) {
  if (!pgms || !pprice) return [];
  const types = String(pgms).split('$;');
  const prices = String(pprice).split('$;');
  const result = [];
  for (let i = 0; i < types.length; i++) {
    result.push({
      product_type: types[i] || '',
      product_price: prices[i] || '0'
    });
  }
  return result;
}

// Helper to format date string to 12-hour AM/PM format (e.g. 09:00 AM)
function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const parts = String(timeStr).split(':');
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1] || '00';
  if (isNaN(hours)) return timeStr;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}

// 1. cat.php - Get Categories
router.all(['/cat.php', '/cat'], async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM category ORDER BY id ASC');
    if (rows.length > 0) {
      return res.json({
        CategoryData: rows,
        ResponseCode: "200",
        Result: "true",
        ResponseMsg: "Category List Founded!"
      });
    } else {
      return res.json({
        ResponseCode: "401",
        Result: "false",
        ResponseMsg: "Category List Not Founded!"
      });
    }
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 2. subcategory.php - Get Subcategories
router.all(['/subcategory.php', '/subcategory'], async (req, res) => {
  try {
    const cat_id = req.body.category_id || req.body.cat_id || req.query.category_id || req.query.cat_id;
    if (!cat_id) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went Wrong!" });
    }
    const { rows } = await db.query('SELECT * FROM subcategory WHERE cat_id = $1 ORDER BY id ASC', [cat_id]);
    if (rows.length === 0) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "SubCategory Not Found!!!" });
    }

    const myarray = [];
    for (const row of rows) {
      const countRes = await db.query('SELECT COUNT(*) FROM product WHERE sid = $1', [row.id]);
      myarray.push({
        id: String(row.id),
        cat_id: String(row.cat_id),
        name: row.name,
        img: row.img,
        count: String(countRes.rows[0].count)
      });
    }

    return res.json({
      data: myarray,
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Subcategory List Founded!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 3. product.php - Get Products by Cat & Subcat
router.all(['/product.php', '/product'], async (req, res) => {
  try {
    const cid = req.body.cid || req.query.cid;
    const sid = req.body.sid || req.query.sid;

    if (!cid && !sid) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went Wrong!" });
    }

    let sql = 'SELECT * FROM product WHERE status = 1';
    const params = [];
    if (cid) {
      params.push(cid);
      sql += ` AND cid = $${params.length}`;
    }
    if (sid) {
      params.push(sid);
      sql += ` AND sid = $${params.length}`;
    }
    sql += ' ORDER BY id DESC';

    const { rows } = await db.query(sql, params);
    if (rows.length === 0) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Product List Not Found!" });
    }

    const pp = rows.map(row => ({
      id: String(row.id),
      cat_id: String(row.cid),
      subcat_id: String(row.sid),
      product_name: row.pname,
      product_image: row.pimg,
      product_related_image: row.prel || '',
      seller_name: row.sname || '',
      short_desc: row.psdesc || '',
      mqty: String(row.mqty || 5),
      price: parseProductPrices(row.pgms, row.pprice),
      stock: String(row.stock),
      discount: String(row.discount || 0)
    }));

    return res.json({
      data: pp,
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Product List Get successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 4. home.php - Home Data Feed
router.all(['/home.php', '/home'], async (req, res) => {
  try {
    const bannersRes = await db.query('SELECT * FROM banner ORDER BY id DESC');
    const categoriesRes = await db.query('SELECT * FROM category ORDER BY id ASC');
    const settingRes = await db.query('SELECT * FROM setting LIMIT 1');
    const homeSectionsRes = await db.query('SELECT * FROM home WHERE status = 1 ORDER BY id ASC');

    const bannerData = bannersRes.rows.map(b => ({
      id: String(b.id),
      bimg: b.bimg,
      cid: String(b.cid)
    }));

    const catData = categoriesRes.rows.map(c => ({
      id: String(c.id),
      catname: c.catname,
      catimg: c.catimg
    }));

    const dynamicSections = [];
    for (const sec of homeSectionsRes.rows) {
      const prodRes = await db.query(
        'SELECT * FROM product WHERE cid = $1 AND sid = $2 AND status = 1 ORDER BY id DESC LIMIT 10',
        [sec.cid, sec.sid]
      );
      const prods = prodRes.rows.map(p => ({
        id: String(p.id),
        cat_id: String(p.cid),
        subcat_id: String(p.sid),
        product_name: p.pname,
        product_image: p.pimg,
        product_related_image: p.prel || '',
        seller_name: p.sname || '',
        short_desc: p.psdesc || '',
        mqty: String(p.mqty || 5),
        price: parseProductPrices(p.pgms, p.pprice),
        stock: String(p.stock),
        discount: String(p.discount || 0)
      }));

      dynamicSections.push({
        title: sec.title,
        cid: String(sec.cid),
        sid: String(sec.sid),
        product_data: prods
      });
    }

    const setting = settingRes.rows[0] ? {
      currency: settingRes.rows[0].currency,
      o_min: String(settingRes.rows[0].o_min),
      tax: String(settingRes.rows[0].tax),
      logo: settingRes.rows[0].logo,
      title: settingRes.rows[0].title
    } : {};

    return res.json({
      Banner: bannerData,
      Catlist: catData,
      Dynamic: dynamicSections,
      Setting: setting,
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Home Data Loaded!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 5. login.php - User / Rider Login
router.all(['/login.php', '/login'], async (req, res) => {
  try {
    const mobile = req.body.mobile || req.body.pin || req.query.mobile;
    const password = req.body.password || req.query.password;

    if (!mobile || !password) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went Wrong!" });
    }

    // First check user table
    const userRes = await db.query('SELECT * FROM "user" WHERE mobile = $1 AND password = $2', [mobile, password]);
    if (userRes.rows.length > 0) {
      const u = userRes.rows[0];
      if (u.status == 0) {
        return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Your Account is Deactivated!" });
      }
      return res.json({
        UserLogin: {
          id: String(u.id),
          name: u.name,
          email: u.email,
          mobile: u.mobile,
          ccode: u.ccode,
          imei: u.imei,
          rdate: u.rdate,
          wallet: String(u.wallet || 0),
          code: String(u.code),
          refercode: String(u.refercode || '')
        },
        ResponseCode: "200",
        Result: "true",
        ResponseMsg: "Login Successfully!"
      });
    }

    // Next check rider table
    const riderRes = await db.query('SELECT * FROM rider WHERE mobile = $1 AND password = $2', [mobile, password]);
    if (riderRes.rows.length > 0) {
      const r = riderRes.rows[0];
      return res.json({
        RiderLogin: {
          id: String(r.id),
          name: r.name,
          mobile: r.mobile,
          email: r.email,
          aid: String(r.aid),
          address: r.address,
          status: String(r.status)
        },
        ResponseCode: "200",
        Result: "true",
        ResponseMsg: "Rider Login Successfully!"
      });
    }

    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Invalid Mobile Number or Password!" });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 6. register.php - User Registration
router.all(['/register.php', '/register'], async (req, res) => {
  try {
    const { name, email, mobile, imei, password, ccode, refercode } = req.body;
    if (!name || !email || !mobile || !password || !ccode) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went Wrong!" });
    }

    const checkMobile = await db.query('SELECT * FROM "user" WHERE mobile = $1', [mobile]);
    if (checkMobile.rows.length > 0) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Mobile Number Already Exists!" });
    }

    // Generate random 6-digit code
    let userCode = Math.floor(100000 + Math.random() * 900000);
    const rdate = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Initial wallet balance
    let initialWallet = 0;
    const settingRes = await db.query('SELECT * FROM setting LIMIT 1');
    const setting = settingRes.rows[0] || {};
    const signupcredit = setting.signupcredit || 0;
    const refercredit = setting.refercredit || 0;

    if (refercode) {
      const parentUserRes = await db.query('SELECT * FROM "user" WHERE code = $1', [refercode]);
      if (parentUserRes.rows.length > 0) {
        initialWallet = signupcredit;
        const parentUser = parentUserRes.rows[0];
        // Credit parent user
        await db.query('UPDATE "user" SET wallet = wallet + $1 WHERE id = $2', [refercredit, parentUser.id]);
        await db.query(
          'INSERT INTO wallet_report (uid, message, status, amt) VALUES ($1, $2, $3, $4)',
          [parentUser.id, 'Refer Bonus Credit', 'Credit', refercredit]
        );
      }
    }

    const insertRes = await db.query(
      'INSERT INTO "user" (name, imei, email, ccode, mobile, rdate, password, status, wallet, code, refercode) VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8, $9, $10) RETURNING *',
      [name, imei || '', email, ccode, mobile, rdate, password, initialWallet, userCode, refercode || null]
    );

    const newUser = insertRes.rows[0];
    if (initialWallet > 0) {
      await db.query(
        'INSERT INTO wallet_report (uid, message, status, amt) VALUES ($1, $2, $3, $4)',
        [newUser.id, 'Signup Bonus Credit', 'Credit', initialWallet]
      );
    }

    return res.json({
      UserLogin: {
        id: String(newUser.id),
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        ccode: newUser.ccode,
        imei: newUser.imei,
        rdate: newUser.rdate,
        wallet: String(newUser.wallet),
        code: String(newUser.code),
        refercode: String(newUser.refercode || '')
      },
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Registration successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 7. timeslot.php - Timeslots List
router.all(['/timeslot.php', '/timeslot'], async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM timeslot ORDER BY id ASC');
    const p = rows.map(r => ({
      id: String(r.id),
      mintime: formatTime12h(r.mintime),
      maxtime: formatTime12h(r.maxtime)
    }));
    return res.json({
      data: p,
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Timeslot Founded!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 8. paymentgateway.php - Active Payment Gateways
router.all(['/paymentgateway.php', '/paymentgateway'], async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM payment_list WHERE status = 1 ORDER BY id ASC');
    return res.json({
      data: rows,
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Payment Gateway Founded!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 9. search.php - Product Search
router.all(['/search.php', '/search'], async (req, res) => {
  try {
    const keyword = req.body.keyword || req.query.keyword;
    if (!keyword) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Product List Not Found!" });
    }
    const { rows } = await db.query('SELECT * FROM product WHERE pname ILIKE $1 AND status = 1 ORDER BY id DESC', [`%${keyword}%`]);
    if (rows.length === 0) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Product List Not Found!" });
    }
    const pp = rows.map(row => ({
      id: String(row.id),
      cat_id: String(row.cid),
      subcat_id: String(row.sid),
      product_name: row.pname,
      product_image: row.pimg,
      product_related_image: row.prel || '',
      seller_name: row.sname || '',
      short_desc: row.psdesc || '',
      mqty: String(row.mqty || 5),
      price: parseProductPrices(row.pgms, row.pprice),
      stock: String(row.stock),
      discount: String(row.discount || 0)
    }));
    return res.json({
      data: pp,
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Product List Get successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 10. profile.php - Update Profile
router.all(['/profile.php', '/profile'], async (req, res) => {
  try {
    const { uid, rid, name, email, mobile, password, ccode, imei } = req.body;
    if (uid) {
      await db.query(
        'UPDATE "user" SET name = $1, email = $2, mobile = $3, password = $4, ccode = $5, imei = COALESCE($6, imei) WHERE id = $7',
        [name, email, mobile, password, ccode, imei || null, uid]
      );
      const userRes = await db.query('SELECT * FROM "user" WHERE id = $1', [uid]);
      const u = userRes.rows[0];
      return res.json({
        UserLogin: {
          id: String(u.id),
          name: u.name,
          email: u.email,
          mobile: u.mobile,
          ccode: u.ccode,
          imei: u.imei,
          rdate: u.rdate,
          wallet: String(u.wallet),
          code: String(u.code),
          refercode: String(u.refercode || '')
        },
        ResponseCode: "200",
        Result: "true",
        ResponseMsg: "Profile Update successfully!"
      });
    } else if (rid) {
      await db.query(
        'UPDATE rider SET name = $1, email = $2, mobile = $3, password = $4 WHERE id = $5',
        [name, email, mobile, password, rid]
      );
      const riderRes = await db.query('SELECT * FROM rider WHERE id = $1', [rid]);
      const r = riderRes.rows[0];
      return res.json({
        RiderLogin: {
          id: String(r.id),
          name: r.name,
          mobile: r.mobile,
          email: r.email,
          aid: String(r.aid),
          address: r.address,
          status: String(r.status)
        },
        ResponseCode: "200",
        Result: "true",
        ResponseMsg: "Profile Update successfully!"
      });
    }
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went Wrong!" });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 11. order.php - Place Order
router.all(['/order.php', '/order'], async (req, res) => {
  try {
    const {
      uid, pname, pid, ptype, pprice, ddate, timesloat, status, qty, total,
      p_method, tax, address_id, tid, coupon_id, cou_amt, wal_amt
    } = req.body;

    if (!uid || !pname || !total) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went Wrong!" });
    }

    const oid = '#' + Math.floor(100000 + Math.random() * 900000);
    const order_date = new Date().toISOString().substring(0, 10);

    // Handle wallet deduction if used
    if (wal_amt && parseFloat(wal_amt) > 0) {
      await db.query('UPDATE "user" SET wallet = wallet - $1 WHERE id = $2', [wal_amt, uid]);
      await db.query(
        'INSERT INTO wallet_report (uid, message, status, amt) VALUES ($1, $2, $3, $4)',
        [uid, `Order ${oid} Payment Deducted`, 'Debit', wal_amt]
      );
    }

    const insertRes = await db.query(
      `INSERT INTO orders 
       (oid, uid, pname, pid, ptype, pprice, ddate, timesloat, order_date, status, qty, total, p_method, tax, address_id, tid, coupon_id, cou_amt, wal_amt)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *`,
      [
        oid, uid, pname, pid, ptype, pprice, ddate, timesloat, order_date,
        status || 'Pending', qty, total, p_method || 'Cash', tax || 0,
        address_id || 0, tid || '', coupon_id || 0, cou_amt || 0, wal_amt || 0
      ]
    );

    return res.json({
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Order Placed Successfully!",
      oid: oid
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 12. history.php - User Order History
router.all(['/history.php', '/history'], async (req, res) => {
  try {
    const uid = req.body.uid || req.query.uid;
    if (!uid) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went Wrong!" });
    }
    const { rows } = await db.query('SELECT * FROM orders WHERE uid = $1 ORDER BY id DESC', [uid]);
    const historyList = rows.map(r => ({
      id: String(r.id),
      oid: r.oid,
      status: r.status,
      total: String(r.total),
      order_date: r.order_date,
      pname: r.pname,
      qty: r.qty,
      ptype: r.ptype,
      pprice: r.pprice
    }));
    return res.json({
      data: historyList,
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Order History Get Successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 13. plist.php - Single Order Detail
router.all(['/plist.php', '/plist'], async (req, res) => {
  try {
    const { id, uid } = req.body;
    if (!uid || !id) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went Wrong!" });
    }
    const { rows } = await db.query('SELECT * FROM orders WHERE uid = $1 AND id = $2', [uid, id]);
    if (rows.length === 0) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Order Not Found!" });
    }
    const o = rows[0];
    const pnames = String(o.pname).split('$;');
    const ptypes = String(o.ptype).split('$;');
    const pprices = String(o.pprice).split('$;');
    const pqtys = String(o.qty).split('$;');
    const pids = String(o.pid).split('$;');

    const items = [];
    for (let i = 0; i < pnames.length; i++) {
      if (pnames[i]) {
        items.push({
          product_name: pnames[i],
          product_type: ptypes[i] || '',
          product_price: pprices[i] || '0',
          product_qty: pqtys[i] || '1',
          product_id: pids[i] || '0'
        });
      }
    }

    return res.json({
      data: {
        id: String(o.id),
        oid: o.oid,
        order_date: o.order_date,
        ddate: o.ddate,
        timesloat: o.timesloat,
        status: o.status,
        total: String(o.total),
        tax: String(o.tax),
        cou_amt: String(o.cou_amt),
        wal_amt: String(o.wal_amt),
        p_method: o.p_method,
        items: items
      },
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Order Detail Get Successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 14. alist.php - User Addresses List
router.all(['/alist.php', '/alist'], async (req, res) => {
  try {
    const uid = req.body.uid || req.query.uid;
    if (!uid) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went Wrong!" });
    }
    const { rows } = await db.query('SELECT * FROM address WHERE uid = $1 AND status = 1 ORDER BY id DESC', [uid]);
    const addresses = rows.map(a => ({
      id: String(a.id),
      uid: String(a.uid),
      hno: a.hno,
      society: a.society,
      area: a.area,
      pincode: String(a.pincode),
      landmark: a.landmark || '',
      type: a.type,
      name: a.name
    }));
    return res.json({
      ResultData: addresses,
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Address List Get Successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 15. address.php - Add / Update Address
router.all(['/address.php', '/address'], async (req, res) => {
  try {
    const { uid, hno, society, area, pincode, landmark, type, name, aid } = req.body;
    if (!uid || !hno || !society || !area) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went Wrong!" });
    }
    if (aid) {
      await db.query(
        'UPDATE address SET hno = $1, society = $2, area = $3, pincode = $4, landmark = $5, type = $6, name = $7 WHERE id = $8 AND uid = $9',
        [hno, society, area, pincode || 0, landmark || '', type || 'Home', name || '', aid, uid]
      );
    } else {
      await db.query(
        'INSERT INTO address (uid, hno, society, area, pincode, landmark, type, name, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1)',
        [uid, hno, society, area, pincode || 0, landmark || '', type || 'Home', name || '']
      );
    }
    return res.json({
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Address Saved Successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 16. add_del.php - Delete Address
router.all(['/add_del.php', '/add_del'], async (req, res) => {
  try {
    const { id, uid } = req.body;
    if (!id || !uid) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went Wrong!" });
    }
    await db.query('UPDATE address SET status = 0 WHERE id = $1 AND uid = $2', [id, uid]);
    return res.json({
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Address Deleted Successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 17. area.php - Get Active Service Areas
router.all(['/area.php', '/area'], async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM area_db WHERE status = '1' OR status = '1.0' ORDER BY id ASC");
    const areaData = rows.map(a => ({
      id: String(a.id),
      name: a.name,
      dcharge: String(a.dcharge),
      status: a.status
    }));
    return res.json({
      AreaData: areaData,
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Area List Found!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 18. couponlist.php - Available Coupons
router.all(['/couponlist.php', '/couponlist'], async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM tbl_coupon WHERE status = 1 ORDER BY id DESC');
    const couponData = rows.map(c => ({
      id: String(c.id),
      c_img: c.c_img,
      cdate: c.cdate,
      c_desc: c.c_desc,
      c_value: String(c.c_value),
      c_title: c.c_title,
      ctitle: c.ctitle,
      min_amt: String(c.min_amt)
    }));
    return res.json({
      CouponList: couponData,
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Coupon List Found!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 19. check_coupon.php - Verify Coupon Code
router.all(['/check_coupon.php', '/check_coupon'], async (req, res) => {
  try {
    const { code, min_amt } = req.body;
    if (!code) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Invalid Coupon Code!" });
    }
    const { rows } = await db.query('SELECT * FROM tbl_coupon WHERE ctitle = $1 AND status = 1', [code]);
    if (rows.length === 0) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Invalid Coupon Code!" });
    }
    const coupon = rows[0];
    if (min_amt && parseFloat(min_amt) < parseFloat(coupon.min_amt)) {
      return res.json({
        ResponseCode: "401",
        Result: "false",
        ResponseMsg: `Minimum Order Amount Must Be ${coupon.min_amt}`
      });
    }
    return res.json({
      c_value: String(coupon.c_value),
      coupon_id: String(coupon.id),
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Coupon Applied Successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 20. wallet.php - Wallet Balance
router.all(['/wallet.php', '/wallet'], async (req, res) => {
  try {
    const uid = req.body.uid || req.query.uid;
    if (!uid) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went wrong try again !" });
    }
    const { rows } = await db.query('SELECT wallet FROM "user" WHERE id = $1', [uid]);
    if (rows.length === 0) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Not Exist User!" });
    }
    return res.json({
      Wallet: String(rows[0].wallet || 0),
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Wallet Balance Get Successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 21. wallet_up.php - Update / Add Wallet Balance
router.all(['/wallet_up.php', '/wallet_up'], async (req, res) => {
  try {
    const { uid, wallet } = req.body;
    if (!uid || !wallet) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went Wrong!" });
    }
    await db.query('UPDATE "user" SET wallet = wallet + $1 WHERE id = $2', [wallet, uid]);
    await db.query(
      'INSERT INTO wallet_report (uid, message, status, amt) VALUES ($1, $2, $3, $4)',
      [uid, 'Wallet Balance Added!!', 'Credit', wallet]
    );
    const userRes = await db.query('SELECT wallet FROM "user" WHERE id = $1', [uid]);
    return res.json({
      wallet: String(userRes.rows[0].wallet),
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Wallet Update successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 22. wallet_report.php - Wallet Transactions Log
router.all(['/wallet_report.php', '/wallet_report'], async (req, res) => {
  try {
    const uid = req.body.uid || req.query.uid;
    if (!uid) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went Wrong!" });
    }
    const { rows } = await db.query('SELECT * FROM wallet_report WHERE uid = $1 ORDER BY id DESC', [uid]);
    return res.json({
      data: rows,
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Wallet Report Get Successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 23. related.php - Related Products
router.all(['/related.php', '/related'], async (req, res) => {
  try {
    const { cid, sid, pid } = req.body;
    if (!cid || !sid) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Product Not Found!" });
    }
    const { rows } = await db.query(
      'SELECT * FROM product WHERE cid = $1 AND sid = $2 AND id != $3 AND status = 1 ORDER BY id DESC LIMIT 10',
      [cid, sid, pid || 0]
    );
    if (rows.length === 0) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Product Not Found!" });
    }
    const pp = rows.map(row => ({
      id: String(row.id),
      cat_id: String(row.cid),
      subcat_id: String(row.sid),
      product_name: row.pname,
      product_image: row.pimg,
      product_related_image: row.prel || '',
      seller_name: row.sname || '',
      short_desc: row.psdesc || '',
      mqty: String(row.mqty || 5),
      price: parseProductPrices(row.pgms, row.pprice),
      stock: String(row.stock),
      discount: String(row.discount || 0)
    }));
    return res.json({
      data: pp,
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Product List Get successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 24. code.php - Country Codes List
router.all(['/code.php', '/code'], async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM code WHERE status = 1 ORDER BY id ASC');
    return res.json({
      CodeData: rows,
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Country Code Get Successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 25. noti.php - User Notifications
router.all(['/noti.php', '/noti'], async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM noti ORDER BY id DESC');
    return res.json({
      NotiData: rows,
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Notification Get Successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 26. ocancle.php - Cancel Order
router.all(['/ocancle.php', '/ocancle'], async (req, res) => {
  try {
    const { id, uid } = req.body;
    if (!id || !uid) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went Wrong!" });
    }
    await db.query('UPDATE orders SET status = $1 WHERE id = $2 AND uid = $3', ['Cancelled', id, uid]);
    return res.json({
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Order Cancelled Successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 27. feed.php - Send Feedback
router.all(['/feed.php', '/feed'], async (req, res) => {
  try {
    const { uid, rate, msg } = req.body;
    if (!uid) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went Wrong!" });
    }
    await db.query('INSERT INTO feedback (uid, rate, msg) VALUES ($1, $2, $3)', [uid, rate || '5', msg || '']);
    return res.json({
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Feedback Sent Successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 28. rate.php - Order Rating
router.all(['/rate.php', '/rate'], async (req, res) => {
  try {
    const { uid, oid, rate, msg } = req.body;
    if (!uid || !oid) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Something Went Wrong!" });
    }
    await db.query('INSERT INTO rate_order (uid, oid, rate, msg) VALUES ($1, $2, $3, $4)', [uid, oid, rate || 5, msg || '']);
    return res.json({
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Order Rated Successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// 29. getdata.php - Main Setting HTML/JS
router.all(['/getdata.php', '/getdata'], async (req, res) => {
  try {
    const { rows } = await db.query('SELECT data FROM main_setting LIMIT 1');
    const data = rows[0] ? rows[0].data : '';
    return res.json({
      data: data,
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Data Get Successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

// Rider Endpoints: olist.php, order_status.php, complete.php, ostatus.php
router.all(['/olist.php', '/olist'], async (req, res) => {
  try {
    const rid = req.body.rid || req.query.rid;
    if (!rid) {
      return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: "Rider ID Required!" });
    }
    const { rows } = await db.query('SELECT * FROM orders WHERE rid = $1 ORDER BY id DESC', [rid]);
    return res.json({
      data: rows,
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Order List Loaded!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

router.all(['/order_status.php', '/order_status'], async (req, res) => {
  try {
    const { oid, rid, status } = req.body;
    await db.query('UPDATE orders SET status = $1, rid = $2 WHERE oid = $3 OR id = $4', [status, rid, oid, oid]);
    return res.json({
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Order Status Updated!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

router.all(['/complete.php', '/complete'], async (req, res) => {
  try {
    const { oid, rid } = req.body;
    await db.query('UPDATE orders SET status = $1, rid = $2 WHERE oid = $3 OR id = $4', ['Completed', rid, oid, oid]);
    return res.json({
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Order Completed Successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

router.all(['/ostatus.php', '/ostatus'], async (req, res) => {
  try {
    const { rid, status } = req.body;
    await db.query('UPDATE rider SET a_status = $1 WHERE id = $2', [status, rid]);
    return res.json({
      ResponseCode: "200",
      Result: "true",
      ResponseMsg: "Rider Status Updated!"
    });
  } catch (err) {
    console.error(err);
    return res.json({ ResponseCode: "401", Result: "false", ResponseMsg: err.message });
  }
});

module.exports = router;
