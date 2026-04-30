const mongoose = require("mongoose");

let checkInSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Habit",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  entries: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["done", "missed"],
        default: "done",
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.models.CheckIn || mongoose.model("CheckIn", checkInSchema);