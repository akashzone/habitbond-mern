const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createHabit, getHabits, requestEditHabit, respondEditHabit, requestDeleteHabit, respondDeleteHabit } = require("../controller/habitController");

router.post("/", authMiddleware, createHabit);
router.get("/:roomId", authMiddleware, getHabits);
router.post("/:habitId/edit-request", authMiddleware, requestEditHabit);
router.post("/:habitId/edit-request/respond", authMiddleware, respondEditHabit);
router.post("/:habitId/delete-request", authMiddleware, requestDeleteHabit);
router.post("/:habitId/delete-request/respond", authMiddleware, respondDeleteHabit);

module.exports = router;