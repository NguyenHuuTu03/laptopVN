const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/role.controllers");

router.get("/", controllers.index);
router.get("/:roleId", controllers.detail);
router.post("/", controllers.create);

router.patch("/permission", controllers.permission);
router.patch("/:roleId/change-status", controllers.changeStatus);
router.patch("/:roleId", controllers.edit);

router.delete("/:roleId", controllers.delete);

module.exports = router;
