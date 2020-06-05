const express = require('express');
const router = express.Router();

const authController = require('../controllers/authenticationController');
const viewController = require('../controllers/viewsController');
const bookingController = require('../controllers/bookingController');

router.get('/', authController.isLoggedIn, bookingController.createBookingCheckout, viewController.getOverview);
router.get('/tour/:slug', authController.protect, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, bookingController.getMyTours);

router.post('/submit-user-data', authController.protect, viewController.updateUserData);
module.exports = router;