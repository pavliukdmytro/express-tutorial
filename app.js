const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Post = require("./models/post");
const path = require("path");
const staticAsset = require('static-asset'); //add hash for static


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticAsset(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/javascripts",
  express.static(path.join(__dirname, "node_modules", "jquery", "dist"))
);

app.get("/", (req, res) => {
  res.render("index");
});

module.exports = app;
