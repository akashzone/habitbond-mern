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

async function joinRoom(req,res){
  try{
  const userId = req.user.id;
  const { roomCode } = req.body;
  console.log(roomCode);
  const room = await Room.findOne({roomCode});

  if(!room){
    return res.status(400).json({
      message :"Room not Found"
    })
  }
  
  if(room.members.length >=2){
    return res.json("Room is fully buddy!");
  }

  if(room.members.includes(userId)){
    return res.json("Joined Already!");
  }
  
  room.members.push(userId);
  await room.save();
  res.send(room);
  }catch(err){
    console.log("Err :",err);
  }
}

module.exports = { createRoom, joinRoom };