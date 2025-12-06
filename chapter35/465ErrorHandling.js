const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { stringify } = require("querystring");

app.set("view engine", "ejs");

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

const monkeyScehma = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
  },
});

const Monkey = mongoose.model("Monkey", monkeyScehma);

//2. save
// app.get("/", (req, res) => {
//   let newMonkey = new Monkey({ name: "monkey abc" });
//   newMonkey
//     .save()
//     .then(() => {
//       res.send("data has been saved.");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

//3. async function use try catch (ex.findOned)
app.get("/", async (req, res, next) => {
  try {
    let foundData = await Monkey.findOne({ name: "monkey abc" });
    res.send(foundData);
  } catch (e) {
    next(e);
  }
});

//5. validator error has to be caught by .catch
app.get("/monkey", (req, res, next) => {
  try {
    let newMonkey = new Monkey({ name: "abc" });
    newMonkey
      .save()
      .then(() => {
        res.send("data has been saved.");
      })
      .catch((err) => {
        res.send(err);
      });
  } catch (e) {
    next(e);
  }
});

//6. findOneandUpdate
app.get("/monkey/update", async (req, res, next) => {
  try {
    await Monkey.findOneAndUpdate(
      { name: "monkey abc" },
      { name: "aaa" },
      { new: true, runValidators: true },
      (err, doc) => {
        if (err) {
          res.send(err);
        } else {
          res.send(doc);
        }
      }
    );
  } catch (e) {
    next(e);
  }
});

//4. /* 404
app.get("/*", async (req, res) => {
  res.status(404).send("404 page not found.");
});

//1. 放在這裡的原因是上面app.get遇到的error即可在下面處理(如故意寫res.sends)
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("something is broken.");
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
