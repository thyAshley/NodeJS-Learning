const express = require('express');

const morgan = require('morgan');

const app = express();

// -- Middlewares --
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

if (process.env.MODE === 'development') 
app.use(morgan('dev'));

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// -- Routes --
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.url} on this server`
    })
})
module.exports = app;