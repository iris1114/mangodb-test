const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.set("view engine", "ejs");
app.use(cookieParser("thisismysecret."));
app.use(
  session({
    secret: "should be an env variable",
    resave: false,
    saveUninitialized: true,
  })
);

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
  console.log(req.session);
  res.send("welcome homepage");
});

//use session
app.get("/verfiyUser", (req, res) => {
  req.session.isVerified = true;
  res.send("you're verified");
});

//isVerified = true 看得見秘密，正常會使用資料庫去儲存session的東西
app.get("/secret", (req, res) => {
  if (req.session.isVerified === true) {
    res.send("my secret is i love panda");
  } else {
    res.status(403).send("you are not authorized");
  }
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
