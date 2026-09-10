const productRoutes = require("./product.router");
const collectionRoutes = require("./collection.router");
const categoryRoutes = require("./category.router");
const brandRoutes = require("./brand.router");
const cartRoutes = require("./cart.router");
const userRoutes = require("./user.router");
const orderRoutes = require("./order.router");

const authMiddleware = require("../../../../middlewares/auth.middleware");

module.exports = (app) => {
  app.use("/api/products", productRoutes);
  app.use("/api/collections", collectionRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/brands", brandRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/order", authMiddleware.requireAuth, orderRoutes);
};
