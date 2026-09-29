const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/order.controllers");

router.get("/", controllers.index);
router.get("/:orderId", controllers.detail);
router.patch("/:orderId/change-status", controllers.changeStatus);

module.exports = router;
