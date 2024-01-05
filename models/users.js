const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true // remove whitespaces
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
    }

});

module.exports = mongoose.model('User', userSchema);