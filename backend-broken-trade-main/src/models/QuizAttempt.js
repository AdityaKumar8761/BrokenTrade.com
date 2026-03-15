const mongoose = require("mongoose");

const QuizAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", index: true, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    answers: { type: [Number], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizAttempt", QuizAttemptSchema);
