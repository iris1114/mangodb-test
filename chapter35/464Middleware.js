const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.set("view engine", "ejs");
// middlewares
app.use(express.static("public"));

//1.req method 因為下方只有用到GET，所以 Cannot POST
// app.use(function (req, res, next) {
//   console.log(req.method); //GET
//   //   req.method = "POST";
//   //   console.log(req.method); //Cannot POST /

//   next();
// });

//2. res.send 2 次， 會報錯 Cannot set headers after they are sent to the client
//在middleware 可以把 life cycle 中斷
// app.use(function (req, res, next) {
//   res.send("this is middleware page");
//   next();
// });

//3. 可以設定哪些middleware在某些route才執行
// app.use("/student", (req, res, next) => {
//   console.log("we reach student middleware");
//   next();
// });

//4. middleware function
const useMiddleware = (req, res, next) => {
  console.log("this is user2 middleware");
  next();
};

//5. 可以加入很多middleware在同一個route
const anotherMiddleware = (req, res, next) => {
  console.log("this is user2 another middleware");
  next();
};

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

app.get("/student", (req, res) => {
  res.send("welcome student page");
});

//4.1 middleware 也可以這樣放
app.get(
  "/user",
  (req, res, next) => {
    res.send("this is user route");
    next();
  },
  (req, res) => {
    res.send("this. user page.");
  }
);

//4.2 這個作法較好
app.get("/user2", useMiddleware, anotherMiddleware, (req, res) => {
  res.send("this is user2 page.");
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
