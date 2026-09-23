const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/cart.controllers");
const authMiddleware = require("../../../../middlewares/auth.middleware");

router.get("/", authMiddleware.requireAuth, controllers.cart);
router.post("/merge", authMiddleware.requireAuth, controllers.merge);
router.post("/sync", authMiddleware.requireAuth, controllers.sync);
router.post("/preview", controllers.preview);
router.post(
  "/apply-coupon",
  authMiddleware.requireAuth,
  controllers.applyCoupon,
);
router.post("/add", authMiddleware.requireAuth, controllers.add);
router.patch(
  "/update/:cartItemId",
  authMiddleware.requireAuth,
  controllers.update,
);
router.delete(
  "/delete/:cartItemId",
  authMiddleware.requireAuth,
  controllers.delete,
);

module.exports = router;
