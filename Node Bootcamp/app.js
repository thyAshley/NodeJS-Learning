const express = require('express');

const morgan = require('morgan');

const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');

const app = express();

// -- Global Middlewares --
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req,res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


if (process.env.MODE === 'development') 
app.use(morgan('dev'));

const limiter = rateLimit({
    max: 5,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour'
});

app.use('/api', limiter);

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