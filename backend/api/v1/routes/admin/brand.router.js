const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/brand.controllers");
router.get("/", controllers.index);
router.post("/", controllers.create);
router.patch("/:brandId/change-status", controllers.changeStatus);
router.get("/:brandId", controllers.detail);
router.patch("/:brandId", controllers.edit);
router.delete("/:brandId", controllers.delete);

module.exports = router;
