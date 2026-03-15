const router = require("express").Router();
const { listPaths, getPathBySlug, getLessonBySlug } = require("../controllers/content.controller");

router.get("/paths", listPaths);
router.get("/paths/:slug", getPathBySlug);
router.get("/lessons/:slug", getLessonBySlug);

module.exports = router;
