const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createHabit, getHabits } = require("../controller/habitController");

router.post("/", authMiddleware, createHabit);
router.get("/:roomId", authMiddleware, getHabits);

module.exports = router;