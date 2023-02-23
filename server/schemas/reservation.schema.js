const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    schoolName: {type: String, required: true},
    numStudentSlotNeed: { type: Number, required: true},
    numAdultSlotNeed: { type: Number, required: true},
    numTotalPeople: { type: Number, required: true},
    numMale: { type: Number, required: true},
    numFemale: { type: Number, required: true},
    grade: { type: String, required: true },
    date: { type: String, required: true},
    period: { type: String, required: true},
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
});

module.exports = mongoose.model('Reservation', reservationSchema);