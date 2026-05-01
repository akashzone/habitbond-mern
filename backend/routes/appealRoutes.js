const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { submitAppeal,respondAppeal } = require("../controller/appealController");

router.post("/", authMiddleware, submitAppeal);
router.patch("/:appealId", authMiddleware, respondAppeal);

module.exports = router;
