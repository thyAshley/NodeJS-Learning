const mongoose = require('mongoose');

const slugify = require('slugify');

const User = require('./userModel');

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
        max: [5, 'Rating must be lower 5.0'],
        set: val => Math.round(val * 10) / 10
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
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: {
                values: ['Point'],
                message: 'Value can only be Point'
            }
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: {
                    values: ['Point'],
                    message: 'Value can only be Point'
                }
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        { 
            type: mongoose.Schema.ObjectId,
            ref: 'user'
        }
    ],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


tourSchema.index({
    price: 1,
    ratingsAverage: 1
});
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' })

tourSchema.virtual('durationInWeeks')
.get(function() {
    return this.duration / 7
});

// virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})

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

tourSchema.pre(/^find/, function(next) {
    this.populate({
            path: 'guides',
            select: '-__v -passwordChangedAt -_id -role'
        });
    next();
})

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

// tourSchema.pre('save', async function(next) {
//     const guidesPromises = this.guides.map(async id => {
//         return await User.findById(id);
//     })
//     this.guides = await Promise.all(guidesPromises);
// })

const Tour = mongoose.model('Tour', schema=tourSchema);

module.exports = Tour;