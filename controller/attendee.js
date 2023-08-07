const Attendee = require('../models/attendee');
const Event = require('../models/event');
const User = require('../models/user');
const Dispenser = require('../models/dispenser');

/**
 * Create an attendee for a particular event
 * @param {String} event_id - Id of event
 * @param {String} user_id - Id of user
 * @returns 
 */
const createAttendee = async (req, res) => {
    try {
        if (!req.body.event_id || !req.body.user_id) {
            throw new Error("Event Id and user Id is required")
        }

        const event = await Event.findById(req.body.event_id);
        if (!event) throw new Error('Event not found');

        const user = await User.findById(req.body.user_id);
        if (!user) throw new Error('User not found');

        let attendee = await Attendee.findOne({ event_id: req.body.event_id, user_id: req.body.user_id })
        if (attendee) throw new Error('This event already has this attendee.');

        attendee = await Attendee({
            event_id: req.body.event_id,
            user_id: req.body.user_id
        }).save();

        return res
            .status(200)
            .json({ status: 200, success: true, message: "Attendee created", data: attendee });

    } catch (error) {
        return res
            .status(400)
            .json({ status: 400, success: false, message: error.message });
    }
}

/**
 * List of all attendees who are either going to or have already attended the specific event.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getEventAttendee = async (req, res) => {
    try {
        const attendees = await Attendee.find({ event_id: req.params.id });

        return res
            .status(200)
            .json({ status: 200, success: true, message: "Event attendees Data", data: attendees });
    } catch (error) {
        return res
            .status(400)
            .json({ status: 400, success: false, message: error.message });
    }
}

/**
 * Start pouring beer
 * @param {String} attendee_id 
 * @param {String} dispenser_id 
 * @returns 
 */
const startPouring = async (req, res) => {
    try {
        if (!req.body.attendee_id || !req.body.dispenser_id) {
            throw new Error("Attendee Id and dispenser Id is required");
        }

        const attendee = await Attendee.findById(req.body.attendee_id);
        if (!attendee) throw new Error("Attendee not found");

        const dispenser = await Dispenser.findById(req.body.dispenser_id);
        if (!dispenser) throw new Error("Dispenser not found");

        if (attendee.event_id.toString() !== dispenser.event_id.toString()) throw new Error("This dispenser is not assigned for this event");

        if (dispenser.status === "OPEN") throw new Error("Dispenser is already in use");

        if (attendee.pouring) throw new Error("This attendee is pouring from another dispenser.");

        await Dispenser.updateOne({ _id: req.body.dispenser_id },
            { $inc: { used_by: 1 }, status: "OPEN", last_used_by: req.body.attendee_id })

        // flow_volume is in ml.
        // Time required to pour whole beer glass (500 ml glass)
        const miliSeconds = (500 / dispenser.flow_volume) * 1000

        setTimeout(async () => {
            const updatedData = await Dispenser.updateOne({ _id: req.body.dispenser_id, last_used_by: req.body.attendee_id, status: "OPEN" },
                { $set: { status: "CLOSE" } })

            if (updatedData.modifiedCount) {
                await Attendee.updateOne({ _id: req.body.attendee_id, pouring: true },
                    { $set: { pouring: false } })
            }
        }, miliSeconds + 100);

        await Attendee.updateOne({ _id: req.body.attendee_id },
            {
                $push: {
                    beer_consumption: {
                        start_time: Date.now(),
                        end_time: Date.now() + miliSeconds,
                        dispenser_id: req.body.dispenser_id
                    }
                },
                pouring: true
            })

        return res
            .status(200)
            .json({ status: 200, success: true, message: "The dispenser has started pouring beer." });
    } catch (error) {
        return res
            .status(400)
            .json({ status: 400, success: false, message: error.message });
    }
}

/**
 * Stop pouring beer
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const stopPouring = async (req, res) => {
    try {
        if (!req.body.attendee_id || !req.body.dispenser_id) {
            throw new Error("Attendee Id and dispenser Id is required");
        }

        const attendee = await Attendee.findById(req.body.attendee_id);
        if (!attendee) throw new Error("Attendee not found");

        const dispenser = await Dispenser.findById(req.body.dispenser_id);
        if (!dispenser) throw new Error("Dispenser not found");

        if (attendee.event_id.toString() != dispenser.event_id.toString()) throw new Error("This dispenser is not assigned for this event");

        if (dispenser.status === "CLOSE") throw new Error("This dispenser is not in use.");

        if (dispenser.last_used_by != req.body.attendee_id) throw new Error("This dispenser is not opended by this attendee.");

        await Dispenser.updateOne({ _id: req.body.dispenser_id },
            { status: "CLOSE" })

        const beerConsumption = [...attendee.beer_consumption];
        const LastObj = beerConsumption.pop();
        beerConsumption.push({
            start_time: LastObj.start_time,
            end_time: Date.now(),
            dispenser_id: LastObj.dispenser_id
        })

        await Attendee.updateOne({ _id: req.body.attendee_id },
            { pouring: false, beer_consumption: beerConsumption })

        return res
            .status(200)
            .json({ status: 200, success: true, message: "The dispenser stopped pouring beer." });
    } catch (error) {
        return res
            .status(400)
            .json({ status: 400, success: false, message: error.message });
    }
}

module.exports = {
    createAttendee,
    getEventAttendee,
    startPouring,
    stopPouring
};