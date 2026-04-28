const User = require("../models/user.js");
const bcrypt = require("bcrypt");

const signUp = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    let checkEmail = await User.findOne({ email });
    if (checkEmail) {
      console.log("Email already exist.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.send({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    console.log("Err :", err);
  }
};

const jwt = require("jsonwebtoken");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.send("wrong credentials!");
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.send("wrong credentials.");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });
    console.log(token);
    res.send({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = { signUp, login };
