const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    description: String
}, { timestamps: true });

module.exports = mongoose.model("Guest", guestSchema);
