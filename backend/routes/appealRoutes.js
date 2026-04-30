const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { submitAppeal } = require("../controller/appealController");

router.post("/", authMiddleware, submitAppeal);

module.exports = router;