
const { signUp, login } = require("../controller/authController.js");
const express = require("express");
const router = express.Router();

router.post("/signup",signUp);
router.post("/login",login);

module.exports = router;