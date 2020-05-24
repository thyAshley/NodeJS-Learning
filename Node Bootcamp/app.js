const express = require('express');

const app = express();

const port = 3000;

const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json(tours);
})


app.listen(port, () => {
    console.log(`server started at on port ${port}`);
})