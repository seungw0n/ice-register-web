const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
    priority: { type: Boolean, required: true },
    schools: { type: Array, required: true }
});

module.exports = mongoose.model('School', schoolSchema);