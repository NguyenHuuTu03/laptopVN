const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/user.controllers");
const authMiddleware = require("../../../../middlewares/auth.middleware");

router.post("/register", controllers.register);
router.post("/login", controllers.login);
router.post("/logout", controllers.logout);
router.get("/profile", authMiddleware.requireAuth, controllers.profile);
router.patch("/profile", authMiddleware.requireAuth, controllers.updateProfile);
router.post("/forgot-password", controllers.forgotPassword);
router.post("/verify-otp", controllers.verifyOtp);
router.post("/reset-password", controllers.resetPassword);
router.patch(
  "/change-password",
  authMiddleware.requireAuth,
  controllers.changePassword,
);

module.exports = router;
