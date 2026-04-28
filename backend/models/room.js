
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomCode : {
        type: String,
        unique: true,
        required: true,
    },
    members : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
},{timestamps: true});

const Room = mongoose.model("Room",roomSchema);
module.exports = Room;