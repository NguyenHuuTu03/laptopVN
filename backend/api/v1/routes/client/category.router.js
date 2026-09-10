const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/category.controllers");
router.get("/", controllers.category);

module.exports = router;
