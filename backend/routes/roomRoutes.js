
const authMiddleware  = require("../middleware/authMiddleware.js");
const { createRoom,joinRoom,getRoomDashboard } = require("../controller/roomController");

const express = require("express");
const router = express.Router();

router.post("/create",authMiddleware,createRoom);
router.post("/join",authMiddleware,joinRoom);
router.get("/:roomId/dashboard",authMiddleware,getRoomDashboard);

module.exports = router;



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjA1NzI0MTdiMzBlMzMxYTE4YmQwZSIsImlhdCI6MTc3NzM1ODY3OSwiZXhwIjoxNzc3OTYzNDc5fQ.6eaUzR-qHSy_2wVUMBGM1r_alDxr7vgaJRUpJJDZFMQ
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjA1ODJkZDcyZmM0NDYzN2I2MjBlOCIsImlhdCI6MTc3NzM1ODkxMCwiZXhwIjoxNzc3OTYzNzEwfQ.oa2RT1s79ozoFIIUhCjfBXu6cpNlExIEZvnYmCFGeBs