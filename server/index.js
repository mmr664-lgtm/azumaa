const app = require('./app');

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Azumaa Delivery Express Server listening on port ${PORT}`);
  });
}

module.exports = app;
