const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    instructorName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        default: ""
    },
    content: [{
        type: {
            type: String,
            enum: ['heading', 'paragraph'],
            required: true
        },
        text: {
            type: String,
            required: true
        }
    }],
    thumbnail: {
        type: String,
        default: ""
    },
    views: {
        type: Number,
        default: 0,
        min: 0,
    },
    enrolledCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
