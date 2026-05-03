const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { submitAppeal,respondAppeal,getAppeals,editAppeal } = require("../controller/appealController");

router.post("/", authMiddleware, submitAppeal);
router.patch("/:appealId", authMiddleware, respondAppeal);
router.get("/:habitId", authMiddleware, getAppeals);
router.put("/:appealId", authMiddleware, editAppeal);

module.exports = router;
