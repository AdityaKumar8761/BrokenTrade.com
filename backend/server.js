const express = require("express");
const app = express();
const db = require('./src/configures/db'); // just import to initialize DB connection


app.use(express.json()); 

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

//Importing the router file(person routes)
const userRouters = require('./src/routes/userRoutes')
app.use('/User' , userRouters) //using the route
    

app.listen(3000, () => {
  console.log("Server started on port 3000");
});