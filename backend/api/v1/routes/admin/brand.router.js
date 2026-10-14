const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/brand.controllers");

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
router.patch("/:brandId/change-status", controllers.changeStatus);
router.get("/:brandId", controllers.detail);
router.patch(
  "/:brandId",
  upload.single("thumbnail"),
  uploadMiddleware.uploadSingle,
  controllers.edit,
);
router.delete("/:brandId", controllers.delete);

module.exports = router;
