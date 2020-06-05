const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a tour']
    },
    user: {
        type: mongoose.schema.ObjectId,
        ref: 'user',
        required: [true, 'Booking must belong to a user'] 
    },
    price: {
        type: Number,
        required: [true, 'Booking must have a price']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
})

bookingSchema.pre(/^find/, function (next){
    this.populate('user').populate({
        path: 'tour',
        select: 'name'
    });
    next();
})
const Booking = mongoose.model('booking', schema=bookingSchema);

module.exports = Booking;