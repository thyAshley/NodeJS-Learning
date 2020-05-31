const fs = require('fs');

const Tour = require('../models/tourModel');

const APIFeatures = require('../utils/apiFeatures');

const catchAsync = require('../utils/catchAsync');

const AppError = require('../utils/appError');


exports.aliasTopTours = (req, res, next) => {
    console.log('in middleware');
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields='name,price,ratingAverage,difficulty';
    next();
};

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: newTour
    })
})

exports.getAllTours = catchAsync(async (req, res, next) => {
    // execute query
    const features = new APIFeatures(Tour, req.query)
    .filter()
    .sort()
    .limitField()
    .paginate();
    const tours = await features.query;
    // send response
    res.status(200).json(
        {
            status: 'success',
            results: tours.length,
            data: tours
        });
});



exports.getTour = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const tour = await Tour.findById(id)
    if (!tour) return next(new AppError('No Tour found with that ID', 404));
    res.status(200).json({
        status: 'success', 
        data: tour
    })
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    })
    if (!tour) return next(new AppError('No Tour found with that ID', 404));
    res.status(200).json({
        status: 'success',
        tour
    })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const tour = await Tour.findByIdAndDelete(id, req.body)
    if (!tour) return next(new AppError('No Tour found with that ID', 200));
    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: { 
                _id: { $toUpper: '$difficulty' }, 
                numTours: { $sum: 1},
                numRating: { $sum: '$ratingsQuantity'},
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
                }
        },
        {
            $sort: { avgPrice: -1 }
        }
    ]);
    res.status(200).json({
        status: 'success',
        stats
    })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = +req.params.year;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: { 
                startDates: { 
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
                }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numToursStarts: { $sum : 1 },
                tours: { $push: '$name' },
            }
        },
        {
            $addFields: {month: '$_id'}
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: {
                numToursStarts: -1,
                month: -1
            }
        },
        {
            $limit: 3
        }
    ]);
    res.status(200).json({
        status: 'success',
        plan
    })
})