const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/category.controllers");
router.get("/", controllers.category);
router.get("/:slug", controllers.detail);

module.exports = router;
