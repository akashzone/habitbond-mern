// models
const User = require("./models/user.js");

// dotenv
require("dotenv").config();
//cors
const cors = require("cors");

// express
const express = require("express");
const app = express();
// const PORT = process.env.PORT || 8080;
const PORT = 3000;

// middlewares
app.use(express.json());
app.use(cors());

// mongoDB
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("Connected MongoDB successfully");
  } catch (err) {
    console.log("MongoDB connection error:", err.message);
  }
}
connectDB();

// routes
const authRoute = require("./routes/authRoutes.js");
const authMiddleware = require("./middleware/authMiddleware.js");
const roomRoute = require("./routes/roomRoutes.js");
const habitRoute = require("./routes/habitRoutes.js");
const checkInRoute = require("./routes/checkInRoutes.js");
const appealRoutes = require("./routes/appealRoutes");

// root route
app.get("/",(req,res)=>{
    res.send("Yes, root route is working.");
})

// auth route 
app.use("/api/auth",authRoute);

// room route
app.use("/api/room",roomRoute);

// habit route
app.use("/api/habit",habitRoute);

// checkIn route
app.use("/api/checkin",checkInRoute);

// appeal route
app.use("/api/appeals", appealRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})