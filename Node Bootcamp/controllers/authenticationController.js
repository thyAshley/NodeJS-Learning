const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const createToken = (userid) => {
    return jwt.sign({ id: userid }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, token, res) => {
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    // cookieOptions.secure = true;

    user.password = undefined;
    res.cookie('jwt', token, cookieOptions)
    res.status(statusCode).json({
        status: 'success',
        token: token,
        data: {
            user: user
        }
    });
    
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    createSendToken(newUser, 201, createToken(newUser._id) ,res)

});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // 1) check email and password exist
    if (!(email && password)) {
        return next(new AppError('Please provide email and password',400))
    }
    // 2) check if user exist and password is correct
    const user = await User.findOne({email: email}).select('+password');
    
    if (!user || !await user.correctPassword(password, user.password)) {

        return next(new AppError('Incorrect Credentials', 401))
        }

    createSendToken(user, 200, createToken(user._id) ,res)
})

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + (10 * 1000)),
        httpOnly: true
    });
    res.status(200).json({
        status: 'success'
    })
}

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check 
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }
    
    if (!token) {
        return next(new AppError('You are not logged in, please log in to get access', 401))
    }
    // 2) Verify token
    const payload = await jwt.verify(token, process.env.JWT_SECRET)

    // 3) Check is user still exists
    const user = await User.findById(payload.id);
    if (!user) return next(new AppError('The user no longer exist', 401));
    // 4) Check if user changed password after JWT was issued
    if (user.changePassword(payload.iat)) return next(new AppError('User recently changed password. Please re-log', 401));

    req.user = user;
    // give access
    next();
})

exports.restrictTo = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POST
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new AppError('There is no user with that email address', 404));

    // 2) Generate User Token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send user email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a password reset with your new password to: ${resetURL}.\nIf you did not send this request, please ignore this email`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request.',
            message: message
        })

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        })

    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error sending the email. Try again later!'), 500)
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token,
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });

    // 2) If token not expired and user is true, set new password
    if (!user) return next(new AppError('Token is invalid or has expired', 400));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) update changedPasswordAt property for the user

    // 4) Log the user in, send JWT
    createSendToken(user, 200, createToken(user._id) ,res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection,
    const user = await User.findById(req.user.id).select('password');
    const checkPassword = await user.correctPassword(req.body.password, user.password);

    if (!checkPassword) return next(new AppError('Your current password is wrong'), 401);
    if (!(req.body.password === req.body.passwordConfirm)) return next(new AppError('Password does not match', 400));
    
    // 3) if password is correct, update password
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.passwordConfirm
    await user.save();

    // 4) log user in again
    createSendToken(user, 200, createToken(user._id) ,res)
})


exports.isLoggedIn = async (req, res, next) => {
    // 1) Getting token and check 
    let token = req.cookies.jwt;
    try {
        if (token) {

            const payload = await jwt.verify(token, process.env.JWT_SECRET)

            const currentUser = await User.findById(payload.id);

            if (!currentUser) return next();
            if (currentUser.changePassword(payload.iat)) return next();

            res.locals.user = currentUser;
            return next(); 
        }
    } catch (err) {
        return next();
    }
    next();
};