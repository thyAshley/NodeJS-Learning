const Review = require('../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.setTourAndUserId = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next(); 
}

exports.getAll = factory.getAll(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.createReview = factory.createOne(Review);
exports.findReview = factory.getOne(Review);