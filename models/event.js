const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: { type: String, required: true, unique: true }
}, {
    timestamps: true
})

module.exports = new mongoose.model('event', eventSchema);