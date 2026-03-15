const { app } = require("./app");
const { PORT } = require("./config/env");
const { connectDB } = require("./config/db");

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
})();
