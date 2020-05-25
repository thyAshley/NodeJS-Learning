const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

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
    if (tour) {
        res.status(200).json({
            status: 'success',
            tour: tour
        })
    } else {
        res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
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
    const postID = req.params.id;
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

