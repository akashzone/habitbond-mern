
const CheckIn = require("../models/CheckIn");

const calculateStreak = async (habitId, roomMembers) => {
  const checkIns = await CheckIn.find({ habitId })
    .sort({ date: -1 });

  let streak = 0;

  for (let checkIn of checkIns) {
    const doneUsers = checkIn.entries
      .filter(e => e.status === "done")
      .map(e => e.userId.toString());

    const allDone = roomMembers.every(
      userId => doneUsers.includes(userId.toString())
    );

    if (allDone) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

module.exports = calculateStreak;