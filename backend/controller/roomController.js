const Room = require("../models/room.js");
const Habit = require("../models/habit.js");
const CheckIn = require("../models/checkIn.js");
const Appeal = require("../models/appeal.js");
const User = require("../models/user.js");
const calculateStreak = require("../utils/streak.js");

const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

async function createRoom(req, res) {
  try {
    const userId = req.user.id;
    const { name, maxMembers } = req.body;

    const room = await Room.create({
      name: name || `Room ${generateCode()}`,
      roomCode: generateCode(),
      owner: userId,
      members: [userId],
      maxMembers: maxMembers ? parseInt(maxMembers) : 2,
    });

    await User.findByIdAndUpdate(userId, { $push: { rooms: room._id } });

    res.status(201).json({
      message: "Room created",
      room,
    });
  } catch (err) {
    console.error("Create Room error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

async function joinRoom(req, res) {
  try {
    const userId = req.user.id;
    const { code } = req.body;
    const roomCode = code || req.body.roomCode;

    if (!roomCode) {
      return res.status(400).json({ message: "Room code is required" });
    }

    const room = await Room.findOne({ roomCode });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const maxMemb = room.maxMembers || 2;
    if (room.members.length >= maxMemb) {
      return res.status(400).json({ message: "Room is already full!" });
    }

    if (room.members.includes(userId)) {
      return res.status(400).json({ message: "You are already a member of this room" });
    }

    room.members.push(userId);
    await room.save();

    await User.findByIdAndUpdate(userId, { $push: { rooms: room._id } });

    res.json(room);
  } catch (err) {
    console.error("Join Room error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

async function leaveRoom(req, res) {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.members = room.members.filter(id => id.toString() !== userId);
    await room.save();

    await User.findByIdAndUpdate(userId, { $pull: { rooms: roomId } });

    res.json({ message: "Successfully left the room", roomId });
  } catch (err) {
    console.error("Leave Room error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

async function getUserRooms(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("rooms");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.rooms || []);
  } catch (err) {
    console.error("Get User Rooms error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

async function getRoomDashboard(req, res) {
  try {
    const { roomId } = req.params;
    const currentUserId = req.user.id;

    const room = await Room.findById(roomId).populate("members", "name email avatar");
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const habits = await Habit.find({ roomId });
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
        const streak = await calculateStreak(habit._id, currentUserId);
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
        name: room.name,
        roomCode: room.roomCode,
        owner: room.owner,
        maxMembers: room.maxMembers,
        members: room.members.map(m => ({ _id: m._id, name: m.name, email: m.email, avatar: m.avatar }))
      },
      habits: habitsWithStreak,
      pendingAppeals: allAppeals,
    });
  } catch (err) {
    console.error("Get Dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createRoom,
  joinRoom,
  leaveRoom,
  getUserRooms,
  getRoomDashboard
};