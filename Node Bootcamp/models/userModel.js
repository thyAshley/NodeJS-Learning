const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
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
    },
    passwordChangeAt: {
        type: Date
    }
})


userSchema.pre('save', async function(next) {
    // if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changePassword = function(JWTTimestamp) {

    if (this.passwordChangeAt) {
        console.log(parseInt(this.passwordChangeAt.getTime() / 1000) > JWTTimestamp )
        return (JWTTimestamp < (parseInt(this.passwordChangeAt.getTime() / 1000)));
    }
    return false;
}

const User = mongoose.model('user', schema=userSchema);

module.exports = User;