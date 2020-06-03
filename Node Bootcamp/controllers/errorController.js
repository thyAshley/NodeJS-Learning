const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field ${value}. Please use another value!`
    return new AppError(message,400);
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = (err) => new AppError('Invalid Token, Please log in again', 401)

const handleJWTExpiredError = (err) => new AppError('Token Expired, Please log in again', 401)

const sendErrorDev = (err, req, res) => { 
    if (req.originalUrl.startsWith('/api')){
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            name: err.name,
            message: err.message,
            stack: err.stack
        })
    }
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
    })
}

const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            res.status(err.statusCode).render('error', {
                title: 'Something went wrong!',
                msg: err.message
            })
        } else {
            console.error('ERROR 🤦‍♂️🤦‍', err);
            res.status(500).render('error', {
                title: 'Something Went Wrong!',
                msg: 'Please try again later.'
            })
        }
    }
    if (err.isOperational) {
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        })
    } else {
        console.error('ERROR 🤦‍♂️🤦‍', err);
        res.status(500).render('error', {
            title: 'Something Went Wrong!',
            msg: 'Please try again later.'
        })
    }    
}

exports.getError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.MODE === 'development') {
        console.log(err)
        sendErrorDev(err, req, res);
    }
    else {
        let error = {...err};
        if (error.name === 'CastError') error = handleCastErrorDB(error)
        if (error.code === 11000) error = handleDuplicateFieldsDB(error)
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);
        sendErrorProd(error, req, res);
    }
}