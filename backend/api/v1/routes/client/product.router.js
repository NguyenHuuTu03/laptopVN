const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/product.controllers");
router.get("/", controllers.index);
router.get("/suggest", controllers.suggest);
router.get("/compare", controllers.compare);
router.get("/:slugProduct/related", controllers.related);
router.get("/:slugProduct", controllers.detailProduct);

module.exports = router;
