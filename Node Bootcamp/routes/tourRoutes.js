const express = require('express');

const router = express.Router();

const tourController = require('../controllers/toursController');
const authController = require('../controllers/authenticationController');
const reviewRouter = require('../routes/reviewRoute');

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap')
.get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats')
.get(tourController.getTourStats);

router.route('/tours-within/:distance/center/:latlon/unit/:unit')
.get(tourController.getToursWithin);

router.route('/distances/:latlon/unit/:unit')
.get(tourController.getDistances);

router.route('/')
.get(tourController.getAllTours)
.post(authController.protect, authController.restrictTo('admin', 'lead-guide'),tourController.createTour);

router.route('/:id')
.get(tourController.getTour)
.patch(
    authController.protect, 
    authController.restrictTo('admin', 'lead-guide'), 
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour)
.delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);


router.route('/monthly-plan/:year')
.get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan);

module.exports = router;