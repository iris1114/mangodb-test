const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(cookieParser("thisismysecret."));

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
  res.cookie("name", "iris");
  res.send("welcome homepage");
});

app.get("/user", (req, res) => {
  console.log(req.cookies); //{ name: 'iris' }
  console.log(req.signedCookies); //取得signedcookies, 如果有更改則為undefined
  const { name } = req.cookies;
  res.send(name + " welcome user page");
});

//做簽名，並非加密
app.get("/getSignedCookies", (req, res) => {
  res.cookie("address", "hawaii", { signed: true });
  res.send("cookies has been send.");
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
