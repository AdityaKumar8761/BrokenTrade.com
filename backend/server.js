require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const db = require('./src/configures/db'); // initialize DB connection
const seedSampleCourse = require('./src/seedSampleCourse');

function runSampleCourseSeed() {
    const run = () => seedSampleCourse().catch((e) => console.error(e));
    if (mongoose.connection.readyState === 1) run();
    else mongoose.connection.once('connected', run);
}
runSampleCourseSeed();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',  // Use env or default
  credentials: true,
}));
app.use(express.json());


// Importing the router file (user routes)
const userRouters = require('./src/routes/userRoutes');
app.use('/User', userRouters); // /User/register  and  /User/login

// Importing documentation routes
const docRouters = require('./src/routes/docRoutes');
app.use('/docs', docRouters);

// Importing course routes
const courseRouters = require('./src/routes/courseRoutes');
app.use('/Courses', courseRouters);

// Serve Static Files from uploads directory
app.use('/uploads', express.static('uploads'));

// Importing upload routes
const uploadRouters = require('./src/routes/uploadRoutes');
app.use('/upload', uploadRouters);

// Importing chat routes
const chatRouters = require('./src/routes/chatRoutes');
app.use('/api/chat', chatRouters);

// ✅ SERVE FRONTEND (THIS IS THE FIX)
// Updated path to point to the 'dist' folder inside the backend directory
const frontendDistPath = path.join(__dirname, "dist");

app.use(express.static(frontendDistPath));

app.get("*path", (req, res) => {
  if (
    !req.path.startsWith("/api") &&
    !req.path.startsWith("/User") &&
    !req.path.startsWith("/docs") &&
    !req.path.startsWith("/Courses") &&
    !req.path.startsWith("/upload")
  ) {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});