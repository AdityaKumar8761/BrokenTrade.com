const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const JournalEntry = require("../models/JournalEntry");
const PaperAccount = require("../models/PaperAccount");
const PaperTrade = require("../models/PaperTrade");

const listEntries = asyncHandler(async (req, res) => {
  const entries = await JournalEntry.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .populate("tradeId")
    .lean();

  res.json({ entries });
});

const createEntry = asyncHandler(async (req, res) => {
  const { title, body, emotions, tags, tradeId } = req.body;

  // If tradeId provided, verify ownership
  if (tradeId) {
    const account = await PaperAccount.findOne({ userId: req.user.id });
    if (!account) throw new ApiError(400, "Create paper account first");

    const trade = await PaperTrade.findOne({ _id: tradeId, accountId: account._id }).lean();
    if (!trade) throw new ApiError(403, "Not your trade or trade not found");
  }

  const entry = await JournalEntry.create({
    userId: req.user.id,
    tradeId: tradeId || undefined,
    title,
    body,
    emotions,
    tags,
  });

  res.status(201).json({ entry });
});

module.exports = { listEntries, createEntry };
