const mongoose = require('mongoose');

const attendeeSchema = mongoose.Schema({
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    beer_consumption: { type: Array, default: [] },
    pouring: { type: Boolean, default: false }
}, {
    timestamps: true
})

module.exports = new mongoose.model('attendee', attendeeSchema);