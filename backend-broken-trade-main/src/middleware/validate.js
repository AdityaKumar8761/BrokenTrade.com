const { ApiError } = require("../utils/ApiError");

function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new ApiError(400, parsed.error.issues.map(i => i.message).join(", ")));
    }
    req.body = parsed.data;
    next();
  };
}

module.exports = { validateBody };
