const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        trim: true,
        unique: true
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a max group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
        default: 4.5,
        type: Number
    },
    ratingsQuantity: {
        default: 0,
        type: Number
    },
    price: {
        type: Number,
        required:  [true, 'A tour must have a price, if free enter 0']
    },
    priceDiscount: {
        type: Number
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a imagecover']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    slug: String,
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

tourSchema.virtual('durationInWeeks')
.get(function() {
    return this.duration / 7
});

// Query Middleware
tourSchema.pre(/^find/, function(next) { 
    this.find({secretTour: { $ne: true }});
    this.select(['-secretTour']);
    this.startQuery = Date.now();
    next();
});

tourSchema.post(/^find/, function(doc, next) {
    console.log(Date.now() - this.startQuery, 'milliseconds');
    next();
})
// Document Middleware
// tourSchema.pre('save', function(next) {
//     this.slug = slugify(this.name, { lower: true });
//     next();
// });


// tourSchema.post('save', function(doc, next){
//     console.log(doc);
//     next();
// });
 

const Tour = mongoose.model('Tour', schema=tourSchema);

module.exports = Tour;