const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    role: { type: String, enum: ["ADMIN", "USER"], default: "USER" }
}, {
    timestamps: true
})

module.exports = new mongoose.model('user', userSchema);