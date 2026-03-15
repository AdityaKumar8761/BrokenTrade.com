const mongoose = require("mongoose");

const JournalEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    tradeId: { type: mongoose.Schema.Types.ObjectId, ref: "PaperTrade" },
    title: { type: String, required: true },
    body: { type: String, required: true },
    emotions: { type: String },
    tags: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JournalEntry", JournalEntrySchema);
