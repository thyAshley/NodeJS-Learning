const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: [40, 'A tour name cannot be longer than 40 characters'],
        minlength: [10, 'A tour name must at least be 10 characters'],
        required: [true, 'A tour must have a name'],
        trim: true,
        unique: true,
        validate: {
            validator: function(val) {
                return /^[a-z0-9\s]+$/i.test(val);
            },
            message: 'can only contain alphanumeric'
        }
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
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult'
        }
    },
    ratingsAverage: {
        default: 4.5,
        type: Number,
        min: [1, 'Rating must be more than 1.0'],
        max: [5, 'Rating must be lower 5.0']
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
        type: Number,
        validate: {
            validator: function(val) {
                return val < this.price
            },
            message: 'Discount price ({VALUE}) cannot be more than regular price'
        }
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
    this.startQuery = Date.now();
    next();
});

tourSchema.post(/^find/, function(doc, next) {
    console.log(Date.now() - this.startQuery, 'milliseconds');
    next();
});

// Aggregation Middleware
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ '$match': { secretTour: { $ne: true } } })
    console.log(this.pipeline());
    next();
});
// Document Middleware
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});


tourSchema.post('save', function(doc, next){
    console.log(doc);
    next();
});
 

const Tour = mongoose.model('Tour', schema=tourSchema);

module.exports = Tour;