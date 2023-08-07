const express = require('express');
const router = express.Router();
const dispenserController = require('../controller/dispenser');

router.post('/create', dispenserController.createDispenser);
router.get('/:id', dispenserController.getDispenser);
router.get('/event/:id', dispenserController.getEventDispensers);

module.exports = router;