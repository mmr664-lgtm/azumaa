const app = require('./server/app');

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Azumaa Delivery Express Server listening on port ${PORT}`);
  });
}

module.exports = app;
