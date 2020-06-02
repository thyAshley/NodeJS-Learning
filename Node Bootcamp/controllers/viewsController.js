const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync( async (req, res, next) => {
    // 1) Get Tour data from collection
    const tours = await Tour.find();

    // 2) Build Template
    
    // 3) Render template using tour data
    res.status(200).render('overview.pug', {
        title: 'All Tours',
        tours
    });
})

exports.getTour = (req, res) => {
    res.status(200).render('tour.pug', {
        title: 'The Forest Hiker'
    })
}
