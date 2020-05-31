const express = require('express');

const router = express.Router({
    mergeParams: true
});

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authenticationController');

router.use(authController.protect);
router.post('/', authController.restrictTo('user'), reviewController.setTourAndUserId, reviewController.createReview);
router.get('/', reviewController.getAll);

router.route('/:id')
.get(reviewController.findReview)
.delete(authController.restrictTo('user','admin'), reviewController.deleteReview)
.patch(authController.restrictTo('user', 'admin'), reviewController.updateReview);

module.exports = router;
