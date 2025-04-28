const express = require('express');
const router = express.Router();
const stationController = require('../controllers/stationControllers.js');

router.get('/stations', stationController.getStations);
router.get('/stations/:id', stationController.getStationById);
router.get('/payments', stationController.paymentHistory);
router.get('/get-reviews', stationController.getReviews);

router.post('/stations', stationController.addStation);
router.post('/connect-charger', stationController.updateChargerStatus);
router.post('/save-payment', stationController.paymentUpdate);
router.post('/add-review', stationController.addReview)

router.put('/stations/:id', stationController.updateStation);
router.delete('/stations/:id', stationController.deleteStation);
router.delete('/stations/:stationId/chargers/:chargerId', stationController.deleteCharger);


module.exports = router;
