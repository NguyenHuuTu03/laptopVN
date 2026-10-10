const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/setting.controllers");
const multer = require("multer");
const upload = multer();
const uploadMiddleware = require("../../../../middlewares/uploadToCloudinary");

router.get("/general", controllers.general);
router.patch(
  "/general",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "sideBar", maxCount: 5 },
  ]),
  uploadMiddleware.uploadFields,
  controllers.updateGeneral,
);

module.exports = router;
