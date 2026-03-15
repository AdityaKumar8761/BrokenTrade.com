const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");

const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId).lean();
  if (!quiz) throw new ApiError(404, "Quiz not found");

  // Don’t leak correct answers in GET
  const safe = {
    _id: quiz._id,
    lessonId: quiz.lessonId,
    title: quiz.title,
    questions: (quiz.questions || []).map((q) => ({
      _id: q._id,
      prompt: q.prompt,
      options: q.options,
    })),
  };

  res.json({ quiz: safe });
});

const submitAttempt = asyncHandler(async (req, res) => {
  const { answers } = req.body;

  const quiz = await Quiz.findById(req.params.quizId).lean();
  if (!quiz) throw new ApiError(404, "Quiz not found");

  const total = quiz.questions.length;
  if (answers.length !== total) {
    throw new ApiError(400, `Expected ${total} answers`);
  }

  let score = 0;
  for (let i = 0; i < total; i++) {
    if (answers[i] === quiz.questions[i].correctIndex) score++;
  }

  const attempt = await QuizAttempt.create({
    userId: req.user.id,
    quizId: quiz._id,
    score,
    total,
    answers,
  });

  res.json({
    attempt: {
      id: attempt._id,
      score: attempt.score,
      total: attempt.total,
      createdAt: attempt.createdAt,
    },
  });
});

module.exports = { getQuiz, submitAttempt };
