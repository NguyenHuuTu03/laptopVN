const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/product.controllers");
const permissionMiddleware = require("../../../../middlewares/permission.middleware");
const multer = require("multer");
const upload = multer();
const uploadMiddleware = require("../../../../middlewares/uploadToCloudinary");

router.get(
  "/",
  permissionMiddleware.requirePermission("product-view"),
  controllers.index,
);
router.post(
  "/",
  permissionMiddleware.requirePermission("product-create"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  uploadMiddleware.uploadFields,
  controllers.create,
);
router.patch(
  "/:productId/change-status",
  permissionMiddleware.requirePermission("product-update"),
  controllers.changeStatus,
);
router.patch(
  "/:productId",
  permissionMiddleware.requirePermission("product-edit"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  uploadMiddleware.uploadFields,
  controllers.edit,
);
router.get(
  "/:productId",
  permissionMiddleware.requirePermission("product-view"),
  controllers.detail,
);
router.delete(
  "/:productId",
  permissionMiddleware.requirePermission("product-delete"),
  controllers.delete,
);

module.exports = router;
