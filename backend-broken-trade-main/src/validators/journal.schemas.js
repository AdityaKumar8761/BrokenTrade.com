const { z } = require("zod");

const createJournalSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  emotions: z.string().optional(),
  tags: z.string().optional(),
  tradeId: z.string().optional(), // optional link to paper trade
});

module.exports = { createJournalSchema };
