const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.set("view engine", "ejs");
// middlewares
app.use(express.static("public"));

app.use(function (req, res, next) {
  console.log("Time:", Date.now());
  next();
});

app.use(function (req, res, next) {
  console.log("second meddiware");
  next();
});

mongoose
  .connect("mongodb://localhost:27017/test", {
    // useFindAndModify: false, //mongo6 not support
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
  res.send("welcome homepage");
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});

// 會依序執行
// 一定要記得加next()
