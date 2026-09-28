const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/product.controllers");

router.get("/", controllers.index);
router.post("/", controllers.create);
router.patch("/:productId/change-status", controllers.changeStatus);
router.patch("/:productId", controllers.edit);
router.get("/:productId", controllers.detail);
router.delete("/:productId", controllers.delete);

module.exports = router;
