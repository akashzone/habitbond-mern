const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
    }],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;