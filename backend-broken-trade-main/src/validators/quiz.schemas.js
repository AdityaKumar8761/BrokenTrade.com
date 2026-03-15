const { z } = require("zod");

const attemptSchema = z.object({
  answers: z.array(z.number().int().nonnegative()),
});

module.exports = { attemptSchema };
