const Review = require('../models/reviewModel');

const catchAsync = require('../utils/catchAsync');

const AppError = require('../utils/appError');

exports.createReview = catchAsync(async (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    const reviews = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        reviews
    })
    next();
});

exports.getReview = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();
    res.status(200).json({
        status: 'success', 
        reviews
    })
    next();
})

