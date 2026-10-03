const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/dashboard.controllers");
router.get("/", controllers.dashboard);

module.exports = router;
