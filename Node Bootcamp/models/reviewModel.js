const mongoose = require('mongoose');

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
    // this.populate({
    //     path: 'user',
    //     select: 'name photo'
    // });
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // });
    this.populate({
        path: 'user',
        select: 'name photo'
    });

    next();
})
const Review = mongoose.model('Review', Schema=reviewSchema);

module.exports = Review;