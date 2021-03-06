const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

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
        type: String,
        default: 'default.jpg'
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
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})


userSchema.pre('save', async function(next) {
    
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirm = undefined;
    next();
})

userSchema.pre('save', async function(next) {
    if (this.isModified('password') && !this.isNew) {
        this.passwordChangeAt = Date.now() - 1000;
        next();
    }
})

userSchema.pre(/^find/, async function(next){ 
    this.find({ active: { $ne: false } });
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changePassword = function(JWTTimestamp) {

    if (this.passwordChangeAt) {
        return (JWTTimestamp < (parseInt(this.passwordChangeAt.getTime() / 1000)));
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(8).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + (10 * 60 * 1000);
    return resetToken
}

const User = mongoose.model('user', schema=userSchema);

module.exports = User;