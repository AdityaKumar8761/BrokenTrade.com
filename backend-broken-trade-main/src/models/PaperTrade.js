const mongoose = require("mongoose");

const PaperTradeSchema = new mongoose.Schema(
  {
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: "PaperAccount", index: true, required: true },
    symbol: { type: String, required: true },
    side: { type: String, enum: ["BUY", "SELL"], required: true },
    quantity: { type: Number, required: true },
    entryPrice: { type: Number, required: true },
    exitPrice: { type: Number },
    fees: { type: Number, default: 0 },
    openedAt: { type: Date, default: Date.now },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaperTrade", PaperTradeSchema);
