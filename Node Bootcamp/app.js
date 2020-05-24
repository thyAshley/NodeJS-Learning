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

app.listen(port, () => {
    console.log(`server started at on port ${port}`);
})