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

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = createToken(newUser._id)
    
    res.status(201).json({
        status: 'success',
        token: token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    
    console.log(email);
    // 1) check email and password exist
    if (!(email && password)) {
        next(new AppError('Please provide email and password',400))
    }
    // 2) check if user exist and password is correct
    const user = await User.findOne({email: email}).select('password');
    if (!user || !await user.correctPassword(password, user.password)) {

        return next(new AppError('Incorrect Credentials', 401))
        }

    const token = createToken(user._id)
    res.status(200).json({
        status: 'success',
        token: token,
        message: 'Login in successfully'
    
    })
})

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check 
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
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
        console.log(role , req.user);
        if (!role.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    console.log(process.env.EMAIL_USERNAME);
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

    console.log(user)
    // 2) If token not expired and user is true, set new password
    if (!user) return next(new AppError('Token is invalid or has expired', 400));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    console.log('password changed');
    // 3) update changedPasswordAt property for the user

    // 4) Log the user in, send JWT
    const token = createToken(user._id);

    res.status(200).json({
        status: 'success',
        token: token,
        message: 'Login in successfully'
    
    })
})

exports.updatePassword = async (req, res, next) => {
    // 1) Get user from collection,
    const currentToken = req.headers.authorization.split(' ')[1];
    const tokenDetails = await jwt.verify(currentToken, process.env.JWT_SECRET);
    const user = await User.findById(tokenDetails.id).select('password');

    if (!user) return next(new AppError('Invalid user, login and try again'), 401);

    const result = await user.correctPassword(req.body.password, user.password);

    if (!result) return next(new AppError('Invalid Password, please try again'), 401);
    

    // 3) if password is correct, update password
    user.password = req.body.newPassword;
    user.save();

    // 4) log user in again
    const newToken = createToken(user._id);

    res.status(200).json({
        status: 'success',
        token: newToken,
        message: 'Login in successfully'
    
    })
}