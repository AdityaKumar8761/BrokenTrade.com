const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { createJournalSchema } = require("../validators/journal.schemas");
const { listEntries, createEntry } = require("../controllers/journal.controller");

router.get("/", requireAuth, listEntries);
router.post("/", requireAuth, validateBody(createJournalSchema), createEntry);

module.exports = router;
