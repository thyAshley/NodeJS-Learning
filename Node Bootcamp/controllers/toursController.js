const fs = require('fs');

const Tour = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields='name,price,ratingAverage,difficulty';
    next();
};

class APIFeatures {
    constructor(query, queryString) {
        this.query = query,
        this.queryString = queryString
    }

    filter() {
        const queryObj = {...this.queryString};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(fields => {
            delete queryObj[fields]
        });
        // 2) Advance Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        console.log(JSON.parse(queryStr));
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitField() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.replace(/,/g, ' ');
            console.log(fields);
            this.thisquery = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = +this.queryString.page || 1;
        const limit = +this.queryString.limit || 5;
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

}

exports.getAllTours = async (req, res) => {
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

