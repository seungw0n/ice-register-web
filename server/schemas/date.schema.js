const mongoose = require("mongoose");

const dateSchema = new mongoose.Schema({
    date: { type: String, required: true },
    numStudentSlotLeft: { type: Number, default: 24, required: true },
    numAdultSlotLeft: { type: Number, default: 1, required: true},
});

module.exports = mongoose.model('Date', dateSchema);

