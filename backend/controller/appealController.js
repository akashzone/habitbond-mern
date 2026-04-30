const Appeal = require("../models/appeal");
const CheckIn = require("../models/checkIn");

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

    res.status(201).json(appeal);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { submitAppeal };