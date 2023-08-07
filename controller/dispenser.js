const attendee = require('../models/attendee');
const Dispenser = require('../models/dispenser');
const Event = require('../models/event');

/**
 * Create a dispenser
 * @param {String} event_id - Id of event for which you want to create a dispenser
 * @param {Number} flow_volume - Beer dispatch capacity per second in ML.
 * @param {Number} beer_price_per_litre - Price of beer per litre
 * @returns 
 */
const createDispenser = async (req, res) => {
    try {
        if (!req.body.event_id) throw new Error("Event id is required")

        if (!req.body.flow_volume) throw new Error("Flow volume is required");

        if (!req.body.beer_price_per_litre) throw new Error("Beer price is required")

        const event = await Event.findById(req.body.event_id)
        if (!event) throw new Error('Event not found');

        const dispenser = await Dispenser({
            event_id: req.body.event_id,
            flow_volume: req.body.flow_volume,
            beer_price_per_litre: req.body.beer_price_per_litre
        }).save();

        return res
            .status(200)
            .json({ status: 200, success: true, message: "Dispenser created", data: dispenser });

    } catch (error) {
        return res
            .status(400)
            .json({ status: 400, success: false, message: error.message });
    }
}

/**
 * Get dispenser info
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getDispenser = async (req, res) => {
    try {
        const dispenser = await Dispenser.findById(req.params.id)
        if (!dispenser) throw new Error("Dispenser not found")

        const attendees = await attendee.find({ event_id: dispenser.event_id })
        let totalTimeOpened = 0

        for (const i of attendees) {
            for (const j of i.beer_consumption) {
                if (j.dispenser_id.toString() == dispenser._id.toString()) {
                    totalTimeOpened += (j.end_time - j.start_time) / 1000
                }
            }
        }

        const totalBeerDispatched = ((totalTimeOpened) * dispenser.flow_volume) / 1000
        const totalBeerDispatchedPrice = (totalBeerDispatched) * dispenser.beer_price_per_litre

        dispenser["_doc"].total_time_opened = totalTimeOpened.toFixed(2)
        dispenser["_doc"].total_beer_dispatched = totalBeerDispatched.toFixed(2)
        dispenser["_doc"].total_beer_dispatched_price = totalBeerDispatchedPrice.toFixed(2)

        return res
            .status(200)
            .json({
                status: 200, success: true, message: "Dispenser Data", data: { dispenser }
            });

    } catch (error) {
        return res
            .status(400)
            .json({ status: 400, success: false, message: error.message });
    }
}

/**
 * Get all the dispenser we have created for the particular event
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getEventDispensers = async (req, res) => {
    try {
        const dispensers = await Dispenser.find({ event_id: req.params.id });

        return res
            .status(200)
            .json({ status: 200, success: true, message: "Event dispensers Data", data: dispensers });
    } catch (error) {
        return res
            .status(400)
            .json({ status: 400, success: false, message: error.message });
    }
}

module.exports = {
    createDispenser,
    getDispenser,
    getEventDispensers
};