const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Course = require('../modules/course');
const Enrollment = require('../modules/enrollment');
const User = require('../modules/user');

function sanitizeContent(content) {
    if (!Array.isArray(content)) return null;
    const out = content
        .filter(
            (b) =>
                b &&
                (b.type === 'heading' || b.type === 'paragraph') &&
                typeof b.text === 'string'
        )
        .map((b) => ({ type: b.type, text: String(b.text).trim() }));
    return out.length ? out : null;
}

async function enrollmentCountsByCourseIds(courseIds) {
    if (!courseIds.length) return new Map();
    const ids = courseIds.map((id) => new mongoose.Types.ObjectId(id));
    const rows = await Enrollment.aggregate([
        { $match: { courseId: { $in: ids } } },
        { $group: { _id: '$courseId', count: { $sum: 1 } } },
    ]);
    const map = new Map();
    for (const row of rows) map.set(String(row._id), row.count);
    return map;
}

function attachEnrollmentCounts(coursesLean, countMap) {
    return coursesLean.map((c) => ({
        ...c,
        enrolledCount: countMap.get(String(c._id)) || 0,
    }));
}

// ─── GET ALL COURSES ──────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 }).lean();
        const countMap = await enrollmentCountsByCourseIds(courses.map((c) => c._id));
        let list = attachEnrollmentCounts(courses, countMap);

        const { userId } = req.query;
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            const enrolledRows = await Enrollment.find({
                userId,
                courseId: { $in: courses.map((c) => c._id) },
            })
                .select('courseId')
                .lean();
            const enrolledSet = new Set(enrolledRows.map((r) => String(r.courseId)));
            list = list.map((c) => ({ ...c, isEnrolled: enrolledSet.has(String(c._id)) }));
        } else {
            list = list.map((c) => ({ ...c, isEnrolled: false }));
        }

        res.status(200).json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── CREATE COURSE (before /:id-style routes) ───────────────────
router.post('/', async (req, res) => {
    try {
        const { instructorId, instructorName, title, category, description, videoUrl, content, thumbnail } =
            req.body;

        const newCourse = new Course({
            instructorId,
            instructorName,
            title,
            category,
            description,
            videoUrl: videoUrl || "",
            content,
            thumbnail: thumbnail || "",
            views: 0,
            enrolledCount: 0,
        });

        const savedCourse = await newCourse.save();
        const countMap = await enrollmentCountsByCourseIds([savedCourse._id]);
        const [payload] = attachEnrollmentCounts([savedCourse.toObject()], countMap);
        res.status(201).json(payload);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── INSTRUCTOR AGGREGATE STATS (before /:id) ─────────────────
router.get('/instructor/:instructorId/stats', async (req, res) => {
    try {
        const { instructorId } = req.params;
        const courses = await Course.find({ instructorId }).sort({ createdAt: -1 }).lean();
        const countMap = await enrollmentCountsByCourseIds(courses.map((c) => c._id));
        const withEnrolled = attachEnrollmentCounts(courses, countMap);
        const totalViews = withEnrolled.reduce((sum, c) => sum + (c.views || 0), 0);
        const totalEnrolled = withEnrolled.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
        res.status(200).json({
            courseCount: withEnrolled.length,
            totalViews,
            totalEnrolled,
            courses: withEnrolled,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── TOTAL COURSE COUNT ─────────────────────────────────────────
router.get('/count', async (req, res) => {
    try {
        const count = await Course.countDocuments();
        res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── GET COURSES BY INSTRUCTOR ────────────────────────────────
router.get('/instructor/:instructorId', async (req, res) => {
    try {
        const courses = await Course.find({ instructorId: req.params.instructorId }).sort({ createdAt: -1 }).lean();
        const countMap = await enrollmentCountsByCourseIds(courses.map((c) => c._id));
        res.status(200).json(attachEnrollmentCounts(courses, countMap));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── ENROLL (real seat count via Enrollment collection) ───────
router.post('/:id/enroll', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Valid userId is required' });
        }

        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        if (String(course.instructorId) === String(userId)) {
            return res.status(400).json({ error: 'Instructors cannot enroll in their own course' });
        }

        try {
            await Enrollment.create({ userId, courseId: course._id });
        } catch (e) {
            if (e && e.code === 11000) {
                const enrolledCount = await Enrollment.countDocuments({ courseId: course._id });
                return res.status(200).json({ enrolledCount, alreadyEnrolled: true });
            }
            throw e;
        }

        const enrolledCount = await Enrollment.countDocuments({ courseId: course._id });
        res.status(201).json({ enrolledCount, alreadyEnrolled: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── INCREMENT VIEWS (catalog engagement) ─────────────────────
router.post('/:id/view', async (req, res) => {
    try {
        const updated = await Course.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json({ views: updated.views });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── GET COURSE BY ID ─────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).lean();
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const countMap = await enrollmentCountsByCourseIds([course._id]);
        const [withCount] = attachEnrollmentCounts([course], countMap);
        const payload = { ...withCount };

        const { userId } = req.query;
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            const exists = await Enrollment.exists({ courseId: course._id, userId });
            payload.isEnrolled = !!exists;
        }

        res.status(200).json(payload);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── UPDATE COURSE (owner instructor only) ────────────────────
router.put('/:id', async (req, res) => {
    try {
        const { userId, title, category, description, videoUrl, thumbnail, content } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Valid userId is required' });
        }

        const editor = await User.findById(userId).select('type name');
        if (!editor || editor.type !== 'Instructor') {
            return res.status(403).json({ error: 'Only instructors can edit courses' });
        }

        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        if (String(course.instructorId) !== String(userId)) {
            return res.status(403).json({ error: 'You can only edit your own courses' });
        }

        const $set = { instructorName: editor.name };

        if (typeof title === 'string' && title.trim()) $set.title = title.trim();
        if (typeof category === 'string' && category.trim()) $set.category = category.trim();
        if (typeof description === 'string') $set.description = description;
        if (typeof videoUrl === 'string') $set.videoUrl = videoUrl;
        if (typeof thumbnail === 'string') $set.thumbnail = thumbnail;

        if (content !== undefined) {
            const clean = sanitizeContent(content);
            if (!clean) {
                return res.status(400).json({ error: 'content must be a non-empty array of heading/paragraph blocks' });
            }
            $set.content = clean;
        }

        const updated = await Course.findByIdAndUpdate(req.params.id, { $set }, { new: true }).lean();
        const countMap = await enrollmentCountsByCourseIds([updated._id]);
        const [payload] = attachEnrollmentCounts([updated], countMap);
        res.status(200).json(payload);
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
        await Enrollment.deleteMany({ courseId: deletedCourse._id });
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
