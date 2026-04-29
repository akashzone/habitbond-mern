const Habit = require("../models/habit.js");

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

    res.json(habits);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createHabit,getHabits };