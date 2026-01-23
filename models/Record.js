const mongoose = require('mongoose');

const RecordSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    game: {
        type: String,
        required: true
    },
    record: {
        type: Number,
        required: true
    },
    string_record: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Record', RecordSchema)