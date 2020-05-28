const User = require('../models/userModel');

const catchAsync = require('../utils/catchAsync')

const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');

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