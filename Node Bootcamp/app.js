const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const compression = require('compression');
const cors = require('cors');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoute');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoute');
const bookingController = require('./controllers/bookingController');

const globalErrorHandler = require('./controllers/errorController')
const path = require('path');

const app = express();
app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());

app.options('*', cors());

// Service Statis Files
app.use(express.static(path.join(__dirname, 'public')));


// -- Global Middlewares --
// Set secure HTTP headers
app.use(helmet());


app.post('/webhook-checkout', express.raw({ type: 'application/json' }), bookingController.webhookCheckout);


// Body Parser, reading data from body to req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: '10kb' })); 
// Data sanitization against noSQL Query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// HPP prevention middleware
app.use(hpp({
    whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'difficulty', 'price', 'maxGroupSize']
}));
// compress all the text to client
app.use(compression());

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


// -- Routes --

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
    const err = new AppError(`Can't find ${req.url} on this server`, 404);
    next(err);
})

app.use(globalErrorHandler.getError);

module.exports = app;