const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/product_variant.controllers");

router.post("/", controllers.create);
router.patch("/:variantId", controllers.edit);
router.delete("/:variantId", controllers.delete);

module.exports = router;
