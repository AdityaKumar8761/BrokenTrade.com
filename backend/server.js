const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
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
  origin: 'http://localhost:5173',  // Vite dev server
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

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

app.listen(5000, () => {
  console.log("Server started on port 5000");
});