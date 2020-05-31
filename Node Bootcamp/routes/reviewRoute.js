const express = require('express');

const router = express.Router();

const reviewController = require('../controllers/reviewController');

const authController = require('../controllers/authenticationController');
router.post('/', authController.protect, authController.restrictTo('user'), reviewController.addReview);
router.get('/', reviewController.getReview);

module.exports = router;
