const express = require("express");
const cors = require("cors");
const app = express();
const db = require('./src/configures/db'); // initialize DB connection

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

app.listen(5000, () => {
  console.log("Server started on port 5000");
});