// models
const User = require("./models/user.js");

// dotenv
require("dotenv").config();

// express
const express = require("express");
const app = express();
// const PORT = process.env.PORT || 8080;
const PORT = 3000;

// mongoDB
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
const main = async() =>{
    await mongoose.connect(uri);
}

main().then(()=>{
    console.log("Connected MongoDB successfully.");
}).catch(err => console.log(err));


// test route
app.get("/",(req,res)=>{
    res.send("Yes, root route is working.");
})

// sample user
app.get("/testuser", async (req, res) => {
  try {
    const user = await User.create({
      name: "Akash",
      email: "akash@test.com",
      password: "123456"
    });

    res.send(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})