const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { CORS_ORIGIN } = require("./config/env");
const routes = require("./routes");
const { apiRateLimiter } = require("./middleware/rateLimit");
const { notFound, errorHandler } = require("./middleware/error");

const app = express();

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(apiRateLimiter);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = { app };
