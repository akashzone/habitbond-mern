
const signUp = require("../controller/authController.js");
const express = require("express");
const router = express.Router();

router.post("/signup",signUp);

module.exports = router;