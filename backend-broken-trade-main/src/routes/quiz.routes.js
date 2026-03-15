const router = require("express").Router();
const { validateBody } = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const { attemptSchema } = require("../validators/quiz.schemas");
const { getQuiz, submitAttempt } = require("../controllers/quiz.controller");

// Public: get quiz (without correct answers)
router.get("/:quizId", getQuiz);

// Auth: submit attempt
router.post("/:quizId/attempt", requireAuth, validateBody(attemptSchema), submitAttempt);

module.exports = router;
