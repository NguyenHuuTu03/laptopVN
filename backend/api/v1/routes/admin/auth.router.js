const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/auth.controllers");
const authMiddleware = require("../../../../middlewares/auth.middleware");

router.post("/login", controllers.login);
router.post("/logout", controllers.logout);
router.get("/profile", authMiddleware.requireAdminAuth, controllers.profile);
router.post("/forgot-password", controllers.forgotPassword);
router.post("/verify-otp", controllers.verifyOtp);
router.post("/reset-password", controllers.resetPassword);
module.exports = router;
