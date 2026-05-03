const CheckIn = require("../models/checkIn.js");
const Appeal = require("../models/appeal");

const calculateStreak = async (habitId, currentUserId) => {
  if (!currentUserId) return 0;
  const checkIns = await CheckIn.find({ habitId });

  let streak = 0;
  let d = new Date();
  let today = d.toISOString().split("T")[0];

  while (true) {
    const dateStr = d.toISOString().split("T")[0];
    const checkIn = checkIns.find(c => c.date === dateStr);
    const isDone = checkIn ? checkIn.entries.some(e => e.userId.toString() === currentUserId.toString() && e.status === "done") : false;

    if (isDone) {
      streak++;
      d.setDate(d.getDate() - 1);
      continue;
    }

    if (dateStr === today) {
      d.setDate(d.getDate() - 1);
      continue;
    }

    const appeal = await Appeal.findOne({ habitId, userId: currentUserId, date: dateStr, status: "accepted" });
    if (appeal) {
      streak++;
      d.setDate(d.getDate() - 1);
      continue;
    }

    break;
  }

  return streak;
};

module.exports = calculateStreak;