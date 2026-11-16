const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/shipper.controllers");
const authMiddleware = require("../../../../middlewares/auth.middleware");

router.get("/orders", controllers.orders);

router.get("/:orderId", authMiddleware.requireAdminAuth, controllers.detail);
router.patch(
  "/:orderId/assignment",
  authMiddleware.requireAdminAuth,
  controllers.assignment,
);
router.patch(
  "/:orderId/change-status",
  authMiddleware.requireAdminAuth,
  controllers.changeStatus,
);

router.get("/", authMiddleware.requireAdminAuth, controllers.shipper);

module.exports = router;
