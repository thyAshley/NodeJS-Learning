const express = require('express');

const router = express.Router({
    mergeParams: true
});

const reviewController = require('../controllers/reviewController');

const authController = require('../controllers/authenticationController');
router.post('/', authController.protect, authController.restrictTo('user'), reviewController.setTourAndUserId, reviewController.createReview);
router.get('/', reviewController.getAll);

router.route('/:id')
.get(reviewController.findReview)
.delete(reviewController.deleteReview)
.patch(reviewController.updateReview);

module.exports = router;
