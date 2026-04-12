const express = require('express');
const router = express.Router();
const Course = require('../modules/course');

// ─── GET ALL COURSES ──────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.status(200).json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── GET COURSE BY ID ─────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── GET COURSES BY INSTRUCTOR ────────────────────────────────
router.get('/instructor/:instructorId', async (req, res) => {
    try {
        const courses = await Course.find({ instructorId: req.params.instructorId }).sort({ createdAt: -1 });
        res.status(200).json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── CREATE COURSE (Note: Authentication check should be added) ────
router.post('/', async (req, res) => {
    try {
        const { instructorId, instructorName, title, category, description, videoUrl, content, thumbnail } = req.body;

        const newCourse = new Course({
            instructorId,
            instructorName,
            title,
            category,
            description,
            videoUrl: videoUrl || "",
            content,
            thumbnail: thumbnail || ""
        });

        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── DELETE COURSE ────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
