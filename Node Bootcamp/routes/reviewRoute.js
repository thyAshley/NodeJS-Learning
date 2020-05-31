const express = require('express');

const router = express.Router({
    mergeParams: true
});

const reviewController = require('../controllers/reviewController');

const authController = require('../controllers/authenticationController');
router.post('/', authController.protect, authController.restrictTo('user'), reviewController.createReview);
router.get('/', reviewController.getReview);

router.route('/:id').delete(reviewController.deleteReview);

module.exports = router;
