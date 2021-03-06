const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getOverview = catchAsync( async (req, res, next) => {
    // 1) Get Tour data from collection
    const tours = await Tour.find();

    // 2) Build Template

    // 3) Render template using tour data
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
})

exports.getTour = catchAsync( async(req, res, next) => {
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    if (!tour) {
        return next(new AppError('There is no tour with that name'), 404);
    }
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    })
})

exports.getLoginForm = (req,res) => {
    res.status(200).render('login', {
        title: 'Login to your account'
    })

}

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Account Details'
    })
}

exports.updateUserData = async (req, res) => {
    const {name, email} = req.body;
    if (name && email) {
        const user = await User.findByIdAndUpdate(req.user.id, {
            name,
            email
        },
        {
            new: true,
            runValidators: true
        })
        res.status(200).render('account', {
            title: 'Account Details',
            user
        })
    }

}