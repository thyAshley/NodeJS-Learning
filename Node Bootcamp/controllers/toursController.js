const fs = require('fs');

const Tour = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields='name,price,ratingAverage,difficulty';
    next();
};

exports.getAllTours = async (req, res) => {
    try {
        console.log(req.query);
        // build query
        // 1) Filtering
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(fields => {
            delete queryObj[fields]
        });

        // 2) Advance Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        console.log(JSON.parse(queryStr));
        let query = Tour.find(JSON.parse(queryStr));

        // 3) Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }
        
        // 4) Field Limiting    
        if (req.query.fields) {
            const fields = req.query.fields.replace(/,/g, ' ');
            console.log(fields);
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // 5) Pagination
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 5;
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();

            if (skip >= numTours) {
                throw new Error('failure');
            }
        }

        // execute query
        const tours = await query;

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

