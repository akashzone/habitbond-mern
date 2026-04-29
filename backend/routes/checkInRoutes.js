const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { markCheckIn, getCheckIn } = require("../controller/checkInController");

router.post("/", authMiddleware, markCheckIn);
router.get("/:habitId", authMiddleware, getCheckIn);

module.exports = router;