const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
const arr = ["hello", "world!", "test"];

app.get("/", (req, res) => res.render("index", { arr }));
app.post("/create", (req, res) => {
  arr.push(req.body.text);
  res.redirect("/");
});

app.get("/create", (req, res) => res.render("create"));

module.exports = app;
