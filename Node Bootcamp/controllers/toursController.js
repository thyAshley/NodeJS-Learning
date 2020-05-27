const fs = require('fs');

const Tour = require('../models/tourModel');

const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
    console.log('in middleware');
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields='name,price,ratingAverage,difficulty';
    next();
};

exports.getAllTours = async (req, res) => {
    console.log(req.query);
    try {
        // execute query
        const features = new APIFeatures(Tour, req.query).filter().sort().limitField().paginate();
        const tours = await features.query;
        // send response
        res.status(200).json(
            {
                status: 'success',
                results: tours.length,
                data: tours
            });
    } catch (err) {
        res.status(400).json({
            status: 'failure',
            message: err
        })
    }
    
}

exports.createTour = async (req, res) => {
    
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: newTour
        })
    } catch (err) {
        res.status(400).json({
            status: 'failure',
            message: err
        })
    }
}

exports.getTour = async (req, res) => {
    const id = req.params.id;
    try {
        const tour = await Tour.findById(id);
        res.status(200).json({
            status: 'success', 
            data: tour
        })
    } catch (err) {
        res.status(404).json({
            status: 'failure',
            message: err
        })
    }
}

exports.updateTour = async (req, res) => {
    const id = req.params.id;
    try {
        const tour = await Tour.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.status(200).json({
            status: 'success',
            tour
        })
    } catch (err) {
        res.status(404).json({
            status: 'failure',
            message: err
        })
    }
}

exports.deleteTour = async (req, res) => {
    const id = req.params.id;
    try {
        const tour = await Tour.findByIdAndDelete(id, req.body)
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch {
        res.status(404).json({
            status: 'failure',
            message: err
        })
    }
}

exports.getTourStats = async (req, res) => {
    try {
        
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
    } catch (err) {
        res.status(404).json({
            status: 'failure',
            message: err 
        })
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(404).json({
            status: 'failure',
            message: err 
        })
    }
}