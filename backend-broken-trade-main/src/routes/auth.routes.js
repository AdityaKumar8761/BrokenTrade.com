const router = require("express").Router();
const { validateBody } = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const { registerSchema, loginSchema } = require("../validators/auth.schemas");
const { register, login, me } = require("../controllers/auth.controller");

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.get("/me", requireAuth, me);

module.exports = router;
