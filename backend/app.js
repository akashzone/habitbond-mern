// models
const User = require("./models/user.js");

// dotenv
require("dotenv").config();
//cors
const cors = require("cors");

// express
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected via socket:", socket.id);

  socket.on("join:room", ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined socket room: ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.set("io", io);
app.use((req, res, next) => {
  req.io = io;
  next();
});

// const PORT = process.env.PORT || 8080;
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://habitbond-mern.vercel.app"
  ],
  credentials: true
}));

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
const userRoutes = require("./routes/userRoutes.js");

// root route
app.get("/",(req,res)=>{
    res.send("Yes, root route is working.");
})

// auth route 
app.use("/api/auth",authRoute);

// users route
app.use("/api/users", userRoutes);

// room route
app.use("/api/room",roomRoute);
app.use("/api/rooms",roomRoute);

// habit route
app.use("/api/habit",habitRoute);
app.use("/api/habits",habitRoute);

// checkIn route
app.use("/api/checkin",checkInRoute);

// appeal route
app.use("/api/appeals", appealRoutes);

server.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})