const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { markLessonComplete, getMyProgress } = require("../controllers/progress.controller");

router.post("/lessons/:lessonId/complete", requireAuth, markLessonComplete);
router.get("/me", requireAuth, getMyProgress);

module.exports = router;
