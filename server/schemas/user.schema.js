const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    schoolName: { type: String, required: true, unique: true },
    password: { type: String, required: true, trim: true },
    managerName: { type: String, required: true },
    directNumber: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);