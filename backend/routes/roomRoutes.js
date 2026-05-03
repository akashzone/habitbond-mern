const authMiddleware = require("../middleware/authMiddleware.js");
const { createRoom, joinRoom, leaveRoom, getUserRooms, getRoomDashboard } = require("../controller/roomController");

const express = require("express");
const router = express.Router();

router.post("/create", authMiddleware, createRoom);
router.post("/", authMiddleware, createRoom);
router.post("/join", authMiddleware, joinRoom);
router.post("/:roomId/leave", authMiddleware, leaveRoom);
router.get("/my", authMiddleware, getUserRooms);
router.get("/:roomId/dashboard", authMiddleware, getRoomDashboard);

module.exports = router;