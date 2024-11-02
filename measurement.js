const mongoose = require('mongoose');
const measurementSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: true,
    },
    temperature: {
        type: Number,
        required: true,
    },
    wind_speed: {
        type: Number,
        required: true,
    },
    visibility: {
        type: Number,
        required: true,
    }
});
const Measurement = mongoose.model('Measurement', measurementSchema);
module.exports = Measurement;
