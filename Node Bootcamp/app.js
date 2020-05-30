const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const AppError = require('./utils/appError');
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();

// -- Global Middlewares --
// Set secure HTTP headers
app.use(helmet());

// Body Parser, reading data from body to req.body
app.use(express.json({ limit: '10kb' }));

// Service Statis Files
app.use(express.static(`${__dirname}/public`));

// Data sanitization against noSQL Query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// HPP prevention middleware
app.use(hpp({
    whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'difficulty', 'price', 'maxGroupSize']
}));

// Test Middleware
app.use((req,res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// Development Logging
if (process.env.MODE === 'development') 
app.use(morgan('dev'));

// Limit request from same API
const limiter = rateLimit({
    max: 50,
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