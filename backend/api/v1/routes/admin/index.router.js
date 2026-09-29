const dashboardRoutes = require("./dashboard.router");
const productRoutes = require("./product.router");
const categoryRoutes = require("./category.router");
const brandRoutes = require("./brand.router");
const productVariantRoutes = require("./product_variant.router");
const orderRoutes = require("./order.router.js");
const shipperRoutes = require("./shipper.router.js");
const userRoutes = require("./user.router.js");
const roleRoutes = require("./role.router.js");
const settingRoutes = require("./setting.router.js");
const authRoutes = require("./auth.router.js");

module.exports = (app) => {
  app.use("/api/admin", dashboardRoutes);
  app.use("/api/admin/products", productRoutes);
  app.use("/api/admin/categories", categoryRoutes);
  app.use("/api/admin/brands", brandRoutes);
  app.use("/api/admin/product-variants", productVariantRoutes);
  app.use("/api/admin/orders", orderRoutes);
  app.use("/api/admin/shipper", shipperRoutes);
  app.use("/api/admin/users", userRoutes);
  app.use("/api/admin/roles", roleRoutes);
  app.use("/api/admin/settings", settingRoutes);
  app.use("/api/admin/auth", authRoutes);
};
