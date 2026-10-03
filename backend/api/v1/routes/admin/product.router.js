const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/product.controllers");
const permissionMiddleware = require("../../../../middlewares/permission.middleware");

router.get(
  "/",
  permissionMiddleware.requirePermission("product.view"),
  controllers.index,
);
router.post(
  "/",
  permissionMiddleware.requirePermission("product.create"),
  controllers.create,
);
router.patch(
  "/:productId/change-status",
  permissionMiddleware.requirePermission("product.update"),
  controllers.changeStatus,
);
router.patch(
  "/:productId",
  permissionMiddleware.requirePermission("product.edit"),
  controllers.edit,
);
router.get(
  "/:productId",
  permissionMiddleware.requirePermission("product.detail"),
  controllers.detail,
);
router.delete(
  "/:productId",
  permissionMiddleware.requirePermission("product.delete"),
  controllers.delete,
);

module.exports = router;
