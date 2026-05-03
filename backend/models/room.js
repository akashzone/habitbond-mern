const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    roomCode: {
        type: String,
        unique: true,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    maxMembers: {
        type: Number,
        default: 2,
    },
},{timestamps: true});

const Room = mongoose.model("Room",roomSchema);
module.exports = Room;