const Room = require("../models/room.js");
const Habit = require("../models/habit.js");
const CheckIn = require("../models/checkIn.js");
const Appeal = require("../models/appeal.js");
const calculateStreak = require("../utils/streak.js");

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

async function getRoomDashboard(req, res) {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId).populate("members", "name email");
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const habits = await Habit.find({ roomId });
    const memberIds = room.members.map(m => m._id.toString());

    const today = new Date().toISOString().split("T")[0];
    const checkIns = await CheckIn.find({
      habitId: { $in: habits.map(h => h._id) },
      date: today
    });

    const appeals = await Appeal.find({
      habitId: { $in: habits.map(h => h._id) }
    }).populate("userId", "name");

    const habitsWithStreak = await Promise.all(
      habits.map(async (habit) => {
        const streak = await calculateStreak(habit._id, memberIds);
        const habitCheckIn = checkIns.find(c => c.habitId.toString() === habit._id.toString());
        const pendingAppealsCount = appeals.filter(a => a.habitId.toString() === habit._id.toString() && a.status === "pending").length;

        return {
          _id: habit._id,
          name: habit.name,
          streak,
          today: {
            date: today,
            entries: habitCheckIn ? habitCheckIn.entries.map(e => ({ userId: e.userId, status: e.status })) : []
          },
          pendingAppealsCount,
          editRequest: habit.editRequest,
          deleteRequest: habit.deleteRequest
        };
      })
    );

    const allAppeals = appeals.map(a => ({
      _id: a._id,
      habitId: a.habitId,
      date: a.date,
      reason: a.reason,
      status: a.status,
      user: a.userId ? { _id: a.userId._id, name: a.userId.name } : null,
      userId: a.userId ? { _id: a.userId._id, name: a.userId.name } : null
    }));

    res.json({
      room: {
        _id: room._id,
        roomCode: room.roomCode,
        members: room.members.map(m => ({ _id: m._id, name: m.name }))
      },
      habits: habitsWithStreak,
      pendingAppeals: allAppeals,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createRoom, joinRoom, getRoomDashboard };