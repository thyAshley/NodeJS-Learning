const express = require('express');

const router = express.Router();

const tourController = require('../controllers/toursController');
const userController = require('../controllers/userController')
router.route('/')
.get(tourController.getAllTours)
.post(tourController.createTour);

router.route('/:id')
.get(tourController.getTour)
.patch(tourController.deleteTour);

module.exports = router;