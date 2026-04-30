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
          room.members
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

module.exports = { createHabit,getHabits };