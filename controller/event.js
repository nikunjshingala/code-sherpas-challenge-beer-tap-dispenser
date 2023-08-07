const Event = require('../models/event');
const User = require('../models/user');

/**
 * Create an event
 * @param {String} name - Required and unique field 
 * @param {String} admin_id - ID of admin who is organizing the event
 * @returns 
 */
const createEvent = async (req, res) => {
    try {
        if (!req.body.name) throw new Error("Event name is required");

        if (!req.body.admin_id) throw new Error("Admin Id is required")

        const admin = await User.findOne({ _id: req.body.admin_id, role: "ADMIN" });
        if (!admin) throw new Error("Admin not found")

        let event = await Event.findOne({ name: req.body.name })
        if (event) throw new Error('This event already happened.');

        event = await Event({
            admin_id: req.body.admin_id,
            name: req.body.name
        }).save();

        return res
            .status(200)
            .json({ status: 200, success: true, message: "Event created", data: event });

    } catch (error) {
        return res
            .status(400)
            .json({ status: 400, success: false, message: error.message });
    }
}

module.exports = {
    createEvent
};