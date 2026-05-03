const Habit = require("../models/habit");
const Room = require("../models/room");
const calculateStreak = require("../utils/streak");

const createHabit = async (req, res) => {
  try {
    const { name, roomId } = req.body;
    const userId = req.user.id;

    const habit = await Habit.create({
      name,
      roomId,
      createdBy: userId,
    });

    if (req.io) {
      req.io.to(roomId.toString()).emit("habit:new", {
        _id: habit._id,
        name: habit.name,
        roomId: habit.roomId,
        createdBy: habit.createdBy,
      });
    }

    res.json(habit);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHabits = async (req, res) => {
  try {
    const { roomId } = req.params;

    const habits = await Habit.find({ roomId });

    const room = await Room.findById(roomId);

    const habitsWithStreak = await Promise.all(
      habits.map(async (habit) => {
        const streak = await calculateStreak(
          habit._id,
          req.user.id
        );

        return {
          ...habit.toObject(),
          streak,
        };
      })
    );

    res.json(habitsWithStreak);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const requestEditHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const { newName } = req.body;
    const userId = req.user.id;

    const habit = await Habit.findById(habitId);
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const room = await Room.findById(habit.roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.members.length <= 1) {
      habit.name = newName;
      await habit.save();
      return res.json(habit);
    }

    habit.editRequest = {
      newName,
      requestedBy: userId,
      status: "pending"
    };
    await habit.save();

    if (req.io) {
      req.io.to(habit.roomId.toString()).emit("habit:editRequest", habit);
    }

    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const respondEditHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const { action } = req.body;
    const userId = req.user.id;

    const habit = await Habit.findById(habitId);
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    if (!habit.editRequest || habit.editRequest.status !== "pending") {
      return res.status(400).json({ message: "No pending edit request found" });
    }

    if (habit.editRequest.requestedBy.toString() === userId) {
      return res.status(403).json({ message: "You cannot respond to your own request" });
    }

    if (action === "accepted") {
      habit.name = habit.editRequest.newName;
      habit.editRequest = undefined;
    } else if (action === "rejected") {
      habit.editRequest = undefined;
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await habit.save();

    if (req.io) {
      req.io.to(habit.roomId.toString()).emit("habit:updated", habit);
    }

    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const requestDeleteHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user.id;

    const habit = await Habit.findById(habitId);
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const room = await Room.findById(habit.roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.members.length <= 1) {
      await Habit.findByIdAndDelete(habitId);
      if (req.io) {
        req.io.to(habit.roomId.toString()).emit("habit:deleted", { habitId });
      }
      return res.json({ message: "Habit deleted directly" });
    }

    habit.deleteRequest = {
      requestedBy: userId,
      status: "pending"
    };
    await habit.save();

    if (req.io) {
      req.io.to(habit.roomId.toString()).emit("habit:deleteRequest", habit);
    }

    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const respondDeleteHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const { action } = req.body;
    const userId = req.user.id;

    const habit = await Habit.findById(habitId);
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    if (!habit.deleteRequest || habit.deleteRequest.status !== "pending") {
      return res.status(400).json({ message: "No pending delete request found" });
    }

    if (habit.deleteRequest.requestedBy.toString() === userId) {
      return res.status(403).json({ message: "You cannot respond to your own request" });
    }

    if (action === "accepted") {
      await Habit.findByIdAndDelete(habitId);
      if (req.io) {
        req.io.to(habit.roomId.toString()).emit("habit:deleted", { habitId });
      }
      return res.json({ message: "Habit deleted" });
    } else if (action === "rejected") {
      habit.deleteRequest = undefined;
      await habit.save();
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    if (req.io) {
      req.io.to(habit.roomId.toString()).emit("habit:updated", habit);
    }

    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createHabit, getHabits, requestEditHabit, respondEditHabit, requestDeleteHabit, respondDeleteHabit };