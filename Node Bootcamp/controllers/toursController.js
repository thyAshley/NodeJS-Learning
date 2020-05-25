const fs = require('fs');

const Tour = require('../models/tourModel');


exports.getAllTours = (req, res) => {
    Tour.find({}, (err, data) => {
        res.status(200).json(
            {
                status: 'success',
                data: data
            });
    })
}

exports.createTour = (req, res) => {
    
    console.log(req);
    const newTour = new Tour({
        name: req.body.name,
        rating: req.body.rating,
        price: req.body.price
    });
    console.log(newTour);
    newTour.save().then(() => {
        res.status(201).json({
            status: 'success',
            data: newTour
        })
    }).catch(err => {
        res.status(404).json({
            status: 'failure',
            message: err
        })
    })
}

exports.getTour = (req, res) => {
    
}

exports.updateTour = (req, res) => {
    
}

exports.deleteTour = (req, res) => {
    
}

