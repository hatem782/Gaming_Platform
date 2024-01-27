const mongoose = require('mongoose');

// Base user schema
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    country: {
        type: String,
        required: true
    },
    onlineID: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    stripeCustomId: String,
    balance: {
        type: Number,
        default: 0
    }
}, { discriminatorKey: 'provider' });

// Facebook user schema
const facebookUserSchema = new mongoose.Schema({

    facebookId: String,
    pic: String,
    secret: String,
    dateOfBirth: { type: Date, required: false },
    onlineID: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    fullname: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
});

// Google user schema
const googleUserSchema = new mongoose.Schema({
    googleId: String,
    pic: String,
    secret: String,
    dateOfBirth: { type: Date, required: false },
    onlineID: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    fullname: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
});

// Create models with Discriminators
const User = mongoose.model('User', userSchema);
const FacebookUser = User.discriminator('facebook', facebookUserSchema);
const GoogleUser = User.discriminator('google', googleUserSchema);

module.exports = {
    User,
    FacebookUser,
    GoogleUser,
};
