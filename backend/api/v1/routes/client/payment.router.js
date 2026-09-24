const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/payment.controllers");

router.post("/vnpay", controllers.paymentVNPay);
router.get("/vnpay-return", controllers.vnpayReturn);

module.exports = router;
