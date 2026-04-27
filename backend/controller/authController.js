const User = require("../models/user.js");
const bcrypt = require("bcrypt");

const signUp = async (req,res) => {
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


module.exports = signUp;