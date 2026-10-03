const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/cart.controllers");
const authMiddleware = require("../../../../middlewares/auth.middleware");

router.get("/", authMiddleware.requireClientAuth, controllers.cart);
router.post("/merge", authMiddleware.requireClientAuth, controllers.merge);
router.post("/sync", authMiddleware.requireClientAuth, controllers.sync);
router.post("/preview", controllers.preview);

router.post("/add", authMiddleware.requireClientAuth, controllers.add);
router.patch(
  "/update/:cartItemId",
  authMiddleware.requireClientAuth,
  controllers.update,
);
router.delete(
  "/delete/:cartItemId",
  authMiddleware.requireClientAuth,
  controllers.delete,
);

module.exports = router;
