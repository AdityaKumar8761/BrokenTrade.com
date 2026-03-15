const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema(
  {
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module", index: true, required: true },
    slug: { type: String, unique: true, index: true, required: true },
    title: { type: String, required: true },
    contentMd: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", LessonSchema);
