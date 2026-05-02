const CheckIn = require("../models/checkIn");
const Habit = require("../models/habit");

const markCheckIn = async (req, res) => {
  try {
    const { habitId } = req.body;
    const userId = req.user.id;

    const today = new Date().toISOString().split("T")[0];

    let checkIn = await CheckIn.findOne({ habitId, date: today });

    if (!checkIn) {
      checkIn = await CheckIn.create({
        habitId,
        date: today,
        entries: [{ userId, status: "done" }],
      });
    } else {
      const existingEntry = checkIn.entries.find(
        (e) => e.userId.toString() === userId
      );

      if (existingEntry) {
        existingEntry.status = "done";
      } else {
        checkIn.entries.push({ userId, status: "done" });
      }

      await checkIn.save();
    }

    const habit = await Habit.findById(habitId);
    if (habit) {
      const io = req.app.get("io");
      if (io) {
        io.to(habit.roomId.toString()).emit("checkin:update", {
          habitId,
          userId,
          date: today
        });
      }
    }

    res.json(checkIn);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getCheckIn = async (req, res) => {
  try {
    const { habitId } = req.params;
    const today = new Date().toISOString().split("T")[0];

    const checkIn = await CheckIn.findOne({ habitId, date: today });

    res.json(checkIn || { entries: [] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { markCheckIn, getCheckIn };