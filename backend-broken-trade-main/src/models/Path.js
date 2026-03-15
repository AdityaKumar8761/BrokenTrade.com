const mongoose = require("mongoose");

const PathSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, index: true, required: true },
    title: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Path", PathSchema);
