const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { submitAppeal,respondAppeal,getAppeals } = require("../controller/appealController");

router.post("/", authMiddleware, submitAppeal);
router.patch("/:appealId", authMiddleware, respondAppeal);
router.get("/:habitId", authMiddleware, getAppeals);

module.exports = router;
