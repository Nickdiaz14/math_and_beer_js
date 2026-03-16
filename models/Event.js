const mongoose = require('mongoose');

const RecordSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    speaker: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    summary: {
        type: JSON,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    video: {
        type: String,
    },
    image: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Event', RecordSchema)