const Room = require("../models/room.js");

const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase(); // ✅ fixed
};

async function createRoom(req, res) {
  try {
    const userId = req.user.id;

    const room = await Room.create({
      roomCode: generateCode(),
      members: [userId],
    });

    console.log(room);

    res.status(201).json({
      message: "Room created",
      room,
    });
  } catch (err) {
    console.log("Err:", err);
    res.status(500).send("Server error");
  }
}

module.exports = createRoom;