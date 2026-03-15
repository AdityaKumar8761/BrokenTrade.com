const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const { ApiError } = require("../utils/ApiError");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next(new ApiError(401, "Missing auth token"));

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}

module.exports = { requireAuth };
