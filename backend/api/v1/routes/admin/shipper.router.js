const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/shipper.controllers");

router.get("/orders", controllers.orders);
router.get("/orders/received", controllers.receivedOrders);
router.get("/:orderId", controllers.detail);
router.patch("/:orderId/accept", controllers.acceptOrder);
router.patch("/:orderId/change-status", controllers.changeStatus);

module.exports = router;
