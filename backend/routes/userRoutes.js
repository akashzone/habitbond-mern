const express = require("express");
const router = express.Router();
const { updateProfile, getProfile } = require("../controller/usersController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/me", authMiddleware, getProfile);
router.patch("/me", authMiddleware, upload.single("avatar"), updateProfile);

module.exports = router;
