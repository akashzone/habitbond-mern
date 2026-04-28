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
const main = async() =>{
    await mongoose.connect(uri);
}

main().then(()=>{
    console.log("Connected MongoDB successfully.");
}).catch(err => console.log(err));

// routes
const authRoute = require("./routes/authRoutes.js");
const authMiddleware = require("./middleware/authMiddleware.js");
const roomRoute = require("./routes/roomRoutes.js");

// root route
app.get("/",(req,res)=>{
    res.send("Yes, root route is working.");
})

// auth route 
app.use("/api/auth",authRoute);

// room route
app.use("/api/room",roomRoute);


app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})