
const { signUp, login } = require("../controller/authController.js");
const authMiddleware  = require("../middleware/authMiddleware.js");
const express = require("express");
const router = express.Router();

router.post("/signup",signUp);
router.post("/login",login);

//protected route
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user
  });
});
module.exports = router;