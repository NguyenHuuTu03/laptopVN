const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/category.controllers");

const multer = require("multer");
const upload = multer();
const uploadMiddleware = require("../../../../middlewares/uploadToCloudinary");

router.get("/", controllers.index);
router.post(
  "/",
  upload.single("thumbnail"),
  uploadMiddleware.uploadSingle,
  controllers.create,
);
router.get("/:categoryId", controllers.detail);
router.patch("/:categoryId/change-status", controllers.changeStatus);
router.patch(
  "/:categoryId",
  upload.single("thumbnail"),
  uploadMiddleware.uploadSingle,
  controllers.edit,
);
router.delete("/:categoryId", controllers.delete);

module.exports = router;
