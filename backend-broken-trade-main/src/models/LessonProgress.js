const mongoose = require("mongoose");

const LessonProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", index: true, required: true },
    status: { type: String, enum: ["IN_PROGRESS", "COMPLETED"], default: "IN_PROGRESS" },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

LessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model("LessonProgress", LessonProgressSchema);
