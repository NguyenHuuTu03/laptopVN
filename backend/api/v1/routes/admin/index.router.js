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
const authMiddleware = require("../../../../middlewares/auth.middleware.js");

module.exports = (app) => {
  app.use("/api/admin/auth", authRoutes);
  app.use("/api/admin", authMiddleware.requireAdminAuth, dashboardRoutes);
  app.use(
    "/api/admin/products",
    authMiddleware.requireAdminAuth,
    productRoutes,
  );
  app.use(
    "/api/admin/categories",
    authMiddleware.requireAdminAuth,
    categoryRoutes,
  );
  app.use("/api/admin/brands", authMiddleware.requireAdminAuth, brandRoutes);
  app.use(
    "/api/admin/product-variants",
    authMiddleware.requireAdminAuth,
    productVariantRoutes,
  );
  app.use("/api/admin/orders", authMiddleware.requireAdminAuth, orderRoutes);
  app.use("/api/admin/shipper", authMiddleware.requireAdminAuth, shipperRoutes);
  app.use("/api/admin/users", authMiddleware.requireAdminAuth, userRoutes);
  app.use("/api/admin/roles", authMiddleware.requireAdminAuth, roleRoutes);
  app.use(
    "/api/admin/settings",
    authMiddleware.requireAdminAuth,
    settingRoutes,
  );
};
