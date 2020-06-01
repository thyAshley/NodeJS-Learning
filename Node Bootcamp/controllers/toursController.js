const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
    console.log('in middleware');
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields='name,price,ratingAverage,difficulty';
    next();
};


exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.getAllTours = factory.getAll(Tour);

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

exports.getToursWithin = catchAsync(async (req, res, next) => {
    const {distance, latlon, unit} = req.params;
    const [lat, lon] = latlon.split(',')
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    if (!lat || !lon) return next(new AppError('Please provide Latitude and longitude in format lat,lon'), 400);

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lon, lat], radius] } }
    })

    console.log(distance, lat, lon, unit);
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
})

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlon, unit } = req.params;
    const [lat, lon] = latlon.split(',')
    if (!lat || !lon) return next(new AppError('Please provide Latitude and longitude in format lat,lon'), 400);
    const distances = await Tour.aggregate([
        {
            $geoNear: { 
                near: {
                    type: 'Point',
                    coordinates: [+lon, +lat]
                },
                distanceField: 'distance'
             }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);
    res.status(200).json({
        status: 'success',
        results: distances.length,
        data: {
            distances
        }
    })
})