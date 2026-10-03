const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const apiRouter = require('./api');
const adminRouter = require('./admin');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Static files for Admin Panel UI
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes at /api and at root for full backwards compatibility
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Mount Admin routes
app.use('/admin', adminRouter);

// Root route serves Web Admin Dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

module.exports = app;
