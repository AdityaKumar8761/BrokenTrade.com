const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema(
  {
    pathId: { type: mongoose.Schema.Types.ObjectId, ref: "Path", index: true, required: true },
    title: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", ModuleSchema);
