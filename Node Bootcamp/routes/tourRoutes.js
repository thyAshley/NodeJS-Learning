const express = require('express');

const router = express.Router();

const tourController = require('../controllers/toursController');

router.route('/')
.get(tourController.getAllTours)
.post(tourController.createTour);

router.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);

// router.route('/top-5-cheap')
// .get(tourController.aliasTopTours, tourController.getAllTour);


module.exports = router;