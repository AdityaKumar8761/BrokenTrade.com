const { z } = require("zod");

const openTradeSchema = z.object({
  symbol: z.string().min(1),
  side: z.enum(["BUY", "SELL"]),
  quantity: z.number().positive(),
  entryPrice: z.number().positive(),
  fees: z.number().nonnegative().optional(), // entry fee
});

const closeTradeSchema = z.object({
  exitPrice: z.number().positive(),
  fees: z.number().nonnegative().optional(), // exit fee
});

module.exports = { openTradeSchema, closeTradeSchema };
