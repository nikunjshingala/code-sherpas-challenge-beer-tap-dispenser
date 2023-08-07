const User = require('../models/user');

/**
 * Create user
 * @param {String} name - required field 
 * @param {String} email - Required and unique field
 * @param {String} role - optional field (default value is "USER")
 * @returns
 */
const createUser = async (req, res) => {
    try {
        if (!req.body.name || !req.body.email) {
            throw new Error("User name/email is required")
        }

        let user = await User.findOne({ email: req.body.email })
        if (user) throw new Error('User with this email already exists.');

        user = await User({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role || "USER"
        }).save();

        return res
            .status(200)
            .json({ status: 200, success: true, message: "User created", data: user });

    } catch (error) {
        return res
            .status(400)
            .json({ status: 400, success: false, message: error.message });
    }
}

/**
 * Get all users
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()

        return res
            .status(200)
            .json({ status: 200, success: true, message: "Users Data", data: users });

    } catch (error) {
        return res
            .status(400)
            .json({ status: 400, success: false, message: error.message });
    }
}

module.exports = {
    createUser,
    getAllUsers
};