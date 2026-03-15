const mongoose = require("mongoose");

const PaperAccountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    currency: { type: String, default: "USD" },
    balance: { type: Number, default: 10000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaperAccount", PaperAccountSchema);
