const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || process.env.JWT_KEY, {
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
        rooms: user.rooms,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "google-oauth",
        avatar: picture
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || process.env.JWT_KEY,
      { expiresIn: "7d" }
    );

    res.json({
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        rooms: user.rooms
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Google login failed" });
  }
};

module.exports = { signUp, login, googleLogin };
