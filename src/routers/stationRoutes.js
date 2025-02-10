const express = require('express');
const router = express.Router();
const stationController = require('../controllers/stationControllers.js');

router.get('/stations', stationController.getStations);
router.post('/stations', stationController.addStation);
router.put('/stations/:id', stationController.updateStation);
router.delete('/stations/:id', stationController.deleteStation);

module.exports = router;
