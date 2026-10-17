const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/user.controllers");

const multer = require("multer");
const upload = multer();
const uploadMiddleware = require("../../../../middlewares/uploadToCloudinary");

router.get("/", controllers.index);
router.get("/:userId", controllers.detail);
router.post(
  "/",
  upload.single("avatar"),
  uploadMiddleware.uploadSingle,
  controllers.create,
);
router.patch(
  "/:userId",
  upload.single("avatar"),
  uploadMiddleware.uploadSingle,
  controllers.edit,
);
router.patch("/:userId/change-status", controllers.changeStatus);
router.patch("/:userId/reset-password", controllers.resetPassword);
router.patch("/:userId/change-password", controllers.changePassword);
router.delete("/:userId", controllers.delete);

module.exports = router;
