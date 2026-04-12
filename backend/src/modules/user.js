const mongoose = require('mongoose');

//Define the User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
    },
    pan: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    type: {
        type: String,
        enum: ['Learner', 'Instructor', 'Broker', 'Admin'],
        required: true,
        default: 'Learner',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    coins: {
        type: Number,
        default: 100000,
    },
    gig: {
        type: String,
        default: "",
    },
    rating: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
    title: {
        type: String,
        default: "",
    },
});

//Create User model
const User = mongoose.model('User', UserSchema);
module.exports = User;