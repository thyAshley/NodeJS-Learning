const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkID = (req, res, next, val) => {
    const tourId =  +val;
    const tour = tours.find((tour) => {
        return tour.id === tourId;
    })
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    next();
}

exports.checkBody = (req, res, next) => {
    const body = req.body;
    if (body.name && body.price) {
        return next();
    }
    return res.status(400).json({
        status: 'fail',
        message: 'Missing name or price'
    })
}

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 200,
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
}

exports.getTour = (req, res) => {
    const tourId = +req.params.id;
    const tour = tours.find((tour) => {
        return tour.id === tourId;
    })
    res.status(200).json({
        status: 'success',
        tour: tour
    })
}

exports.createTour = (req, res) => {
    const newID = tours.length;
    const newTour = {id: newID, ...req.body};
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
}

exports.updateTour = (req, res) => {
    res.status(200).json(
        {
            status: 'success',
            data: {
                tour: '<Updated Tour>'
            }
        }
    )
}

exports.deleteTour = (req, res) => {
    console.log('ok')
    res.status(204).json({
        status: 'ok'
    })
}

