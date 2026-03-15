const mongoose = require("mongoose");

const QuizQuestionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true },
    explanation: { type: String },
  },
  { _id: true }
);

const QuizSchema = new mongoose.Schema(
  {
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", unique: true, required: true },
    title: { type: String, required: true },
    questions: { type: [QuizQuestionSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", QuizSchema);
