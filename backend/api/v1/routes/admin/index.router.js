const dashboardRoutes = require("./dashboard.router");
const productRoutes = require("./product.router");
const categoryRoutes = require("./category.router");
const brandRoutes = require("./brand.router");
const productVariantRoutes = require("./product_variant.router");

module.exports = (app) => {
  app.use("/api/admin", dashboardRoutes);
  app.use("/api/admin/products", productRoutes);
  app.use("/api/admin/categories", categoryRoutes);
  app.use("/api/admin/brands", brandRoutes);
  app.use("/api/admin/product-variants", productVariantRoutes);
};
