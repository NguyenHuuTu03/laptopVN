const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/product.controllers");
router.get("/", controllers.index);
router.get("/compare", controllers.compare);
router.get("/:slugProduct", controllers.detailProduct);

module.exports = router;
