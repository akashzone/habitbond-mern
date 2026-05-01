
const CheckIn = require("../models/CheckIn");
const Appeal = require("../models/appeal");

const calculateStreak = async (habitId, roomMembers) => {
  const checkIns = await CheckIn.find({ habitId }).sort({ date: -1 });

  let streak = 0;

  for (let checkIn of checkIns) {
    const date = checkIn.date;

    const doneUsers = checkIn.entries
      .filter(e => e.status === "done")
      .map(e => e.userId.toString());

    const allDone = roomMembers.every(
      userId => doneUsers.includes(userId.toString())
    );

    if (allDone) {
      streak++;
      continue;
    }

    let validDay = true;

    for (let member of roomMembers) {
      const userId = member.toString();

      if (doneUsers.includes(userId)) continue;

      const appeal = await Appeal.findOne({
        habitId,
        userId,
        date,
      });

      if (!appeal) {
        validDay = false;
        break;
      }

      if (appeal.status === "rejected") {
        validDay = false;
        break;
      }

      if (appeal.status === "pending") {
        return streak;
      }
    }

    if (validDay) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};
module.exports = calculateStreak;