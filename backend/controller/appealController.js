const Appeal = require("../models/appeal");
const CheckIn = require("../models/checkIn");
const Room = require("../models/room");
const Habit = require("../models/habit");

const submitAppeal = async (req, res) => {
  try {
    const { habitId, reason } = req.body;
    const userId = req.user.id;

    const today = new Date().toISOString().split("T")[0];

    const checkIn = await CheckIn.findOne({ habitId, date: today });

    const userEntry = checkIn?.entries.find(
      (e) => e.userId.toString() === userId
    );

    if (userEntry && userEntry.status === "done") {
      return res.status(400).json({
        message: "You already completed this habit"
      });
    }

    const existingAppeal = await Appeal.findOne({
      habitId,
      userId,
      date: today,
    });

    if (existingAppeal) {
      return res.status(400).json({
        message: "Appeal already submitted"
      });
    }

    const appeal = await Appeal.create({
      habitId,
      userId,
      date: today,
      reason,
    });

    const habit = await Habit.findById(habitId);
    if (habit) {
      const io = req.app.get("io");
      if (io) {
        io.to(habit.roomId.toString()).emit("appeal:new", {
          habitId,
          reason,
          user: req.user
        });
      }
    }

    res.status(201).json(appeal);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const respondAppeal = async (req, res) => {
  try {
    const { appealId } = req.params;
    const { action } = req.body;
    const userId = req.user.id;
    const appeal = await Appeal.findById(appealId);

    if (!appeal) {
      return res.status(404).json({ message: "Appeal not found" });
    }

    if (appeal.status !== "pending") {
      return res.status(400).json({ message: "Already responded" });
    }

    const habit = await Habit.findById(appeal.habitId);
    const room = await Room.findById(habit.roomId);

    if (appeal.userId.toString() === userId) {
      return res.status(403).json({
        message: "You cannot respond to your own appeal"
      });
    }

    if (!room.members.includes(userId)) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    // 5. Update status
    if (action === "accepted") {
      appeal.status = "accepted";
    } else if (action === "rejected") {
      appeal.status = "rejected";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    appeal.respondedAt = new Date();

    await appeal.save();

    const io = req.app.get("io");
    if (io && habit) {
      io.to(habit.roomId.toString()).emit("appeal:response", {
        appealId,
        status: appeal.status
      });
    }

    res.json(appeal);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAppeals = async (req, res) => {
  try {
    const { habitId } = req.params;

    const appeals = await Appeal.find({ habitId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json(appeals);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { submitAppeal, respondAppeal, getAppeals };