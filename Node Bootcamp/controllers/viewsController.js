const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

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

exports.getTour = catchAsync( async(req, res) => {
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    })
})