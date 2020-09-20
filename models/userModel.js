const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Mongoose schema for a document of the user collection
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please give your name']
    },
    email: {
        type: String,
        required: [true, 'Please give your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    city: {
        type: String,
        required: [true, 'Please provide the city you are living']
    },
    country: {
        type: String,
        required: [true, 'Please provide your country']
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords does not match'
        }
    },
    point: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    ranking: {
        type: Number,
        default: 0
    },
    userPosts: {
        type: Array,
        items: {
            type: String
        },
        default: []
    },
    passwordChangedAt: Date
});

// Encrypt password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

// Check the password if user enters correctly
//instance method that be available on all the document
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }

    //False = password not changed
    return false;
}
const users = mongoose.model('users', userSchema);
module.exports = users;