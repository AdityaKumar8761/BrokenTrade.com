const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { openTradeSchema, closeTradeSchema } = require("../validators/paper.schemas");
const {
  getAccount,
  createAccount,
  listTrades,
  openTrade,
  closeTrade,
} = require("../controllers/paper.controller");

router.get("/account", requireAuth, getAccount);
router.post("/account", requireAuth, createAccount);

router.get("/trades", requireAuth, listTrades);
router.post("/trades/open", requireAuth, validateBody(openTradeSchema), openTrade);
router.post("/trades/:tradeId/close", requireAuth, validateBody(closeTradeSchema), closeTrade);

module.exports = router;
