const dashboardRoutes = require("./dashboard.router");
const productRoutes = require("./product.router");

module.exports = (app) => {
  app.use("/api/admin", dashboardRoutes);
  app.use("/api/admin/products", productRoutes);
};
