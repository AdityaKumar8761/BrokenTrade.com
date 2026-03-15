const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");

const markLessonComplete = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;

  const lesson = await Lesson.findById(lessonId).select({ _id: 1 });
  if (!lesson) throw new ApiError(404, "Lesson not found");

  const progress = await LessonProgress.findOneAndUpdate(
    { userId: req.user.id, lessonId },
    { status: "COMPLETED", completedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({ progress });
});

const getMyProgress = asyncHandler(async (req, res) => {
  const items = await LessonProgress.find({ userId: req.user.id })
    .select({ lessonId: 1, status: 1, completedAt: 1, createdAt: 1 })
    .lean();
  res.json({ progress: items });
});

module.exports = { markLessonComplete, getMyProgress };
