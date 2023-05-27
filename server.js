const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const app = express();
const userAuth = require("./routes/userAuth");
const adminAuth = require("./routes/adminAuth");
const configureFlight = require("./routes/configureFlight");
const bookFLight = require("./routes/bookFlight");

// middlewares // 
app.use(express.json());
app.use(cors());


// Routes //

// user register and login middleware //
app.use('/user-auth', userAuth);

// admin register and login middleware //
app.use('/admin-auth', adminAuth);

// admin configure flight middleware //
app.use('/flight', configureFlight);

// book flights //
app.use('/', bookFLight);

app.get("/", (req, res) => {
    res.status(200).json({
      type: "success",
      message: "server is up and running",
      data: null,
    });
  });

  // page not found error handling  middleware
app.use("*", (req, res) => {
    res.status(404).send("Api endpoint does not found");
  });

app.listen(5000, ()=>{
    console.log("Server is runing on http://localhost:5000/");
});