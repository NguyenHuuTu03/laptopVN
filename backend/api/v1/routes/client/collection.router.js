const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/collection.controllers");
router.get("/:slug", controllers.collections);

module.exports = router;
