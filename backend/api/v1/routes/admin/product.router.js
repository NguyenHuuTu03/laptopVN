const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/product.controllers");

router.get("/", controllers.index);
router.patch("/:productId/change-status", controllers.changeStatus);
router.post("/", controllers.create);

module.exports = router;
