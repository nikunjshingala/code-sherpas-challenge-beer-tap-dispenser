const express = require('express');
const router = express.Router();
const eventController = require('../controller/event');

router.post('/create', eventController.createEvent);

module.exports = router;

