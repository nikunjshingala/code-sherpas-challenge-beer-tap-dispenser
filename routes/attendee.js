const express = require('express');
const router = express.Router();
const attendeeController = require('../controller/attendee');

router.post('/create', attendeeController.createAttendee);
router.get('/event/:id', attendeeController.getEventAttendee);
router.post('/pour', attendeeController.startPouring);
router.post('/pour/stop', attendeeController.stopPouring);

module.exports = router; 