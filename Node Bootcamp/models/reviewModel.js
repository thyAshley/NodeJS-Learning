const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Review must have a rating']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, 'Review must belong to a user']
    }

}, 
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next();
});


reviewSchema.statics.calcAverageRatings = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ])
    console.log(stats);
    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating
    });
    
};

reviewSchema.index({
    tour: 1,
    user: 1
}, {
    unique: true
})

reviewSchema.post('save', function() {
    this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {

    this.r = await this.findOne();
    console.log(this.r);
    next();
})

reviewSchema.post(/^findOneAnd/, async function() {
    console.log('##############', this.r);
    await this.r.constructor.calcAverageRatings(this.r.tour);
})

const Review = mongoose.model('Review', Schema=reviewSchema);

module.exports = Review;