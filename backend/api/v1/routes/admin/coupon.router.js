const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/admin/coupon.controllers");

router.get("/", controllers.index);
router.post("/", controllers.create);
router.patch("/:couponId/change-status", controllers.changeStatus);
router.get("/:couponId", controllers.detail);
router.patch("/:couponId", controllers.edit);
router.delete("/:couponId", controllers.delete);
module.exports = router;
