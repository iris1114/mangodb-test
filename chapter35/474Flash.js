require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.use(cookieParser(process.env.SECRET));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

mongoose
  .connect("mongodb://localhost:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mongodb.");
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/", (req, res) => {
  req.flash("succes_msg", "successfully get homepage");
  res.send("hi," + req.flash("succes_msg"));
});

app.get("/*", async (req, res) => {
  res.status(404).send("404 page not found.");
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("something is broken.");
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
