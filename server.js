// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
// const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require('morgan');
const cookieSession = require('cookie-session');


app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static(__dirname + "/public"));

// Separated Routes for each Resource
const mapsRoutes = require("./routes/maps");
const userRoutes = require("./routes/users");
const favRoutes = require("./routes/favorites")
const pinRoutes = require("./routes/pins");

// Mount all resource routes
app.use('/maps', mapsRoutes);
app.use('/login', userRoutes);
app.use('/favorites', favRoutes);
app.use('/pins', pinRoutes);


// Home page
app.get("/", (req, res) => {
  const userID = req.session.user_id;

  const templateVars = { userID }

  res.render("index", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
