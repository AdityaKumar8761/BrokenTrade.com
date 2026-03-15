const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const PaperAccount = require("../models/PaperAccount");
const PaperTrade = require("../models/PaperTrade");

const getAccount = asyncHandler(async (req, res) => {
  const account = await PaperAccount.findOne({ userId: req.user.id }).lean();
  res.json({ account: account || null });
});

const createAccount = asyncHandler(async (req, res) => {
  const existing = await PaperAccount.findOne({ userId: req.user.id });
  if (existing) return res.status(200).json({ account: existing });

  const account = await PaperAccount.create({
    userId: req.user.id,
    currency: "USD",
    balance: 10000,
  });

  res.status(201).json({ account });
});

const listTrades = asyncHandler(async (req, res) => {
  const account = await PaperAccount.findOne({ userId: req.user.id });
  if (!account) throw new ApiError(400, "Create paper account first");

  const trades = await PaperTrade.find({ accountId: account._id })
    .sort({ openedAt: -1 })
    .lean();

  res.json({ trades });
});

const openTrade = asyncHandler(async (req, res) => {
  const { symbol, side, quantity, entryPrice, fees = 0 } = req.body;

  const account = await PaperAccount.findOne({ userId: req.user.id });
  if (!account) throw new ApiError(400, "Create paper account first");

  const q = Number(quantity);
  const p = Number(entryPrice);
  const entryFee = Number(fees);

  // We subtract ENTRY fee always; for BUY also subtract cost.
  const cost = side === "BUY" ? q * p : 0;
  const totalDebit = cost + entryFee;

  // Atomic balance check for BUY (and fee too)
  const updatedAccount = await PaperAccount.findOneAndUpdate(
    { _id: account._id, balance: { $gte: totalDebit } },
    { $inc: { balance: -totalDebit } },
    { new: true }
  );

  if (!updatedAccount) throw new ApiError(400, "Insufficient paper balance");

  const trade = await PaperTrade.create({
    accountId: account._id,
    symbol,
    side,
    quantity: q,
    entryPrice: p,
    fees: entryFee, // fees will store total fees (entry + exit)
    openedAt: new Date(),
  });

  res.status(201).json({ trade, account: updatedAccount });
});

const closeTrade = asyncHandler(async (req, res) => {
  const { exitPrice, fees = 0 } = req.body;

  const account = await PaperAccount.findOne({ userId: req.user.id });
  if (!account) throw new ApiError(400, "Create paper account first");

  const trade = await PaperTrade.findOne({ _id: req.params.tradeId, accountId: account._id });
  if (!trade) throw new ApiError(404, "Trade not found");
  if (trade.closedAt) throw new ApiError(400, "Trade already closed");

  const exitP = Number(exitPrice);
  const exitFee = Number(fees);

  // Delta logic:
  // - BUY: credit back proceeds (qty*exit - exitFee). Entry cost already deducted on open.
  // - SELL (educational short): credit PnL only: (entry - exit)*qty - exitFee. Entry fee already deducted on open.
  let delta = 0;
  if (trade.side === "BUY") {
    delta = trade.quantity * exitP - exitFee;
  } else {
    delta = (trade.entryPrice - exitP) * trade.quantity - exitFee;
  }

  // Update trade first (ensure not closed), then update account
  const updatedTrade = await PaperTrade.findOneAndUpdate(
    { _id: trade._id, closedAt: { $exists: false } },
    {
      $set: { exitPrice: exitP, closedAt: new Date() },
      $inc: { fees: exitFee }, // accumulate total fees
    },
    { new: true }
  );

  if (!updatedTrade) throw new ApiError(400, "Trade already closed");

  const updatedAccount = await PaperAccount.findByIdAndUpdate(
    account._id,
    { $inc: { balance: delta } },
    { new: true }
  );

  res.json({ trade: updatedTrade, account: updatedAccount });
});

module.exports = { getAccount, createAccount, listTrades, openTrade, closeTrade };
