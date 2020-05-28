const express = require('express');

const morgan = require('morgan');

const AppError = require('./utils/appError');

const app = express();

// -- Middlewares --
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

if (process.env.MODE === 'development') 
app.use(morgan('dev'));

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController')

// -- Routes --
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next) => {
    const err = new AppError(`Can't find ${req.url} on this server`, 404);
    next(err);
})

app.use(globalErrorHandler.getError);

module.exports = app;