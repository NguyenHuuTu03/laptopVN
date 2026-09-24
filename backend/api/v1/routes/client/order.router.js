const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/order.controllers");
const orderValidation = require("../../../../validations/client/order.validation");

router.get("/checkout", controllers.checkout);
router.post("/apply-coupon", controllers.applyCoupon);
router.post("/", orderValidation.createOrder, controllers.order);
router.get("/my-orders", controllers.myOrders);
router.get("/:orderId", controllers.myOrders);
router.patch("/cancel/:orderId", controllers.myOrders);

module.exports = router;
