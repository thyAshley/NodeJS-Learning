const Review = require('../models/reviewModel');

const catchAsync = require('../utils/catchAsync');

const AppError = require('../utils/appError');

exports.addReview = catchAsync(async (req, res, next) => {
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

