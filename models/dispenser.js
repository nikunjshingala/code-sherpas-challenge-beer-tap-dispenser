const mongoose = require('mongoose');

const dispenserSchema = mongoose.Schema({
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
        required: true
    },
    flow_volume: { type: Number, required: true },
    beer_price_per_litre: { type: Number, required: true },
    status: { type: String, enum: ["OPEN", "CLOSE"], default: 'CLOSE' },
    used_by: { type: Number, default: 0 },
    last_used_by: { type: String }
}, {
    timestamps: true
})

module.exports = new mongoose.model('dispenser', dispenserSchema);