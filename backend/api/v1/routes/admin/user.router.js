const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/user.controllers");

router.get("/", controllers.index);
router.get("/:userId", controllers.detail);
router.post("/", controllers.create);
router.patch("/:userId", controllers.edit);
router.patch("/:userId/change-status", controllers.changeStatus);
router.patch("/:userId/reset-password", controllers.resetPassword);
router.delete("/:userId", controllers.delete);

module.exports = router;
