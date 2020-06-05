const express = require('express');
const authController = require('../controllers/authenticationController');
const bookingController = require('../controllers/bookingController');
const router = express.Router({
    mergeParams: true
});

router.get('/checkout-session/:tourId', authController.protect, bookingController.getCheckoutSession)

module.exports = router;