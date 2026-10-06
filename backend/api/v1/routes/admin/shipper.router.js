const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/shipper.controllers");
const authMiddleware = require("../../../../middlewares/auth.middleware");

router.get("/orders", controllers.orders);
router.get(
  "/orders/received",
  authMiddleware.requireAdminAuth,
  controllers.receivedOrders,
);
router.get("/:orderId", authMiddleware.requireAdminAuth, controllers.detail);
router.patch(
  "/:orderId/accept",
  authMiddleware.requireAdminAuth,
  controllers.acceptOrder,
);
router.patch(
  "/:orderId/change-status",
  authMiddleware.requireAdminAuth,
  controllers.changeStatus,
);

module.exports = router;
