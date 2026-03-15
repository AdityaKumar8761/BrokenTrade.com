const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/content", require("./content.routes"));
router.use("/progress", require("./progress.routes"));
router.use("/quizzes", require("./quiz.routes"));
router.use("/paper", require("./paper.routes"));
router.use("/journal", require("./journal.routes"));

module.exports = router;
