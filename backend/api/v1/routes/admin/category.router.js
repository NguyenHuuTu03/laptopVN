const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/category.controllers");

router.get("/", controllers.index);
router.post("/", controllers.create);
router.get("/:categoryId", controllers.detail);
router.patch("/:categoryId/change-status", controllers.changeStatus);
router.patch("/:categoryId", controllers.edit);
router.delete("/:categoryId", controllers.delete);

module.exports = router;
