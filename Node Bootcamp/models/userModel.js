const mongoose = require('mongoose');

const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: {
            validator: function(val) {
                return validator.isEmail(val);
            },
            message: 'Please provide a valid email'
        }
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide a password'],
        validate: {
            validator: function(val) {
                return this.password === val;
            },
            message: 'Password are not the same'
        }
    }
})


userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();
    
})

const User = mongoose.model('user', schema=userSchema);

module.exports = User;