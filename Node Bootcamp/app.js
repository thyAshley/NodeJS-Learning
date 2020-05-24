const express = require('express');

const app = express();

const port = 3000;

const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.use(express.json());

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 200,
        results: tours.length,
        data: {
            tours
        }
    });
})

app.get('/api/v1/tours/:id?', (req, res) => {
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
})

app.post('/api/v1/tours', (req, res) => {
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
})

app.patch('/api/v1/tours/:id', (req, res) => {
    const postID = req.params.id;
    res.status(200).json(
        {
            status: 'success',
            data: {
                tour: '<Updated Tour>'
            }
        }
    )
})

app.delete('/api/v1/tours/:id', (req, res) => {
    const postID = req.params.id;
    res.status(204).json(
        {
            status: 'success',
            data: null
        }
    )
})


app.listen(port, () => {
    console.log(`server started at on port ${port}`);
})