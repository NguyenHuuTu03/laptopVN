const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/brand.controllers");
router.get("/", controllers.brand);

module.exports = router;