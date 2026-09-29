const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/setting.controllers");

router.get("/general", controllers.general);
router.patch("/general", controllers.updateGeneral);

module.exports = router;
