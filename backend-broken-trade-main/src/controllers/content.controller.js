const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const Path = require("../models/Path");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const Quiz = require("../models/Quiz");

const listPaths = asyncHandler(async (req, res) => {
  const paths = await Path.find().sort({ createdAt: 1 });
  res.json({ paths });
});

const getPathBySlug = asyncHandler(async (req, res) => {
  const path = await Path.findOne({ slug: req.params.slug });
  if (!path) throw new ApiError(404, "Path not found");

  const modules = await Module.find({ pathId: path._id }).sort({ order: 1 }).lean();
  const moduleIds = modules.map(m => m._id);

  const lessons = await Lesson.find({ moduleId: { $in: moduleIds } })
    .sort({ order: 1 })
    .select({ slug: 1, title: 1, order: 1, moduleId: 1 })
    .lean();

  // group lessons by moduleId
  const lessonsByModule = new Map();
  lessons.forEach(l => {
    const k = String(l.moduleId);
    if (!lessonsByModule.has(k)) lessonsByModule.set(k, []);
    lessonsByModule.get(k).push(l);
  });

  const result = modules.map(m => ({ ...m, lessons: lessonsByModule.get(String(m._id)) || [] }));
  res.json({ path, modules: result });
});

const getLessonBySlug = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findOne({ slug: req.params.slug }).lean();
  if (!lesson) throw new ApiError(404, "Lesson not found");

  const quiz = await Quiz.findOne({ lessonId: lesson._id })
    .select({ title: 1, questions: 1 })
    .lean();

  // Don’t leak correct answers publicly:
  if (quiz?.questions?.length) {
    quiz.questions = quiz.questions.map(q => ({ _id: q._id, prompt: q.prompt, options: q.options }));
  }

  res.json({ lesson, quiz: quiz || null });
});

module.exports = { listPaths, getPathBySlug, getLessonBySlug };
