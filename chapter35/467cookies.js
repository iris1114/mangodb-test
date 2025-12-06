const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(cookieParser());

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

//1.res cookie
app.get("/", (req, res) => {
  res.cookie("name", "iris");
  res.send("welcome homepage");
});

// 2. request cookie (要使用cookie-parser)
app.get("/user", (req, res) => {
  console.log(req.cookies); //{ name: 'iris' }
  const { name } = req.cookies;
  res.send(name + " welcome user page");
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
