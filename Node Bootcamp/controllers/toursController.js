const fs = require('fs');

const Tour = require('../models/tourModel');


exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find({})
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
        res.send(404).json({
            status: 'failure',
            message: 'id cannot be found'
        })
    }
}

exports.updateTour = (req, res) => {
    
}

exports.deleteTour = (req, res) => {
    
}

