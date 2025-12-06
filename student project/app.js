const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); //取得request的body
const Student = require("./models/student");
const methodOverride = require("method-override"); //put delete 可以使用這個 https://www.npmjs.com/package/method-override
const { response } = require("express");

// app.use(express.json());  //json format data
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); //middleware
app.use(methodOverride("_method")); //use method
app.set("view engine", "ejs"); //template engines 樣版引擎是幫助我們以最小的code 去新增一個Html Template， https://expressjs.com/en/resources/template-engines.html
// mongoose.set("useFindAndModify", false); //? <-- no longer necessary

mongoose
  .connect("mongodb://localhost:27017/studentDB", {
    useNewUrlParser: true, //? <-- no longer necessary
    useUnifiedTopology: true, //? <-- no longer necessary
  })
  .then(() => {
    console.log("Successfully connected to mongoDB.");
  })
  .catch((e) => {
    console.log("Connection failed.");
    console.log(e);
  });

app.get("/", (req, res) => {
  res.send("This is homepage.");
});

//新增資料至studentDB with ejs
app.get("/students/insert", (req, res) => {
  res.render("studentInsert.ejs");
});

//把資料傳儲存進db
app.post("/students/insert", (req, res) => {
  let { id, name, age, merit, other } = req.body;
  let newStudent = new Student({
    id,
    name,
    age,
    scholarship: { merit, other },
  });
  newStudent
    .save()
    .then(() => {
      console.log("Student accepted.");
      res.render("accept.ejs");
    })
    .catch((e) => {
      console.log("Student not accepted.");
      console.log(e);
      res.render("reject.ejs");
    });
});

//read all students
app.get("/students", async (req, res) => {
  try {
    let data = await Student.find();
    res.render("students.ejs", { data });
  } catch {
    res.send("Error with finding data.");
  }
});

//read one student
app.get("/students/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let data = await Student.findOne({ id });
    if (data !== null) {
      //findOne 如果沒有找到, 會return null
      res.render("studentPage.ejs", { data });
    } else {
      res.send("Cannot find this student. Please enter a valid id.");
    }
  } catch (e) {
    res.send("Error!!");
    console.log(e);
  }
});

//edit page
app.get("/students/edit/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let data = await Student.findOne({ id });
    if (data !== null) {
      res.render("edit.ejs", { data });
    } else {
      res.send("Cannot find student.");
    }
  } catch {
    res.send("Error!");
  }
});

//findOneAndUpdate
app.put("/students/edit/:id", async (req, res) => {
  let { id, name, age, merit, other } = req.body;
  try {
    let d = await Student.findOneAndUpdate(
      { id }, //filter
      { id, name, age, scholarship: { merit, other } }, //update
      {
        new: true, //set the new option to true to return the document after update was applied.
        runValidators: true, //runValidators in model
      }
    );
    res.redirect(`/students/${id}`);
  } catch {
    res.render("reject.ejs");
  }
});

app.delete("/students/delete/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let data = await Student.deleteOne({ id });
    if (data !== null) {
      res.render("deleteSuccess.ejs");
    } else {
      res.send("Delete failed.");
    }
  } catch {
    res.send("Delete failed.");
  }
});

// app.delete("/students/delete/:id", (req, res) => {
//   let { id } = req.params;
//   Student.deleteOne({ id })
//     .then((meg) => {
//       console.log(meg);
//       res.send("Deleted successfully.");
//     })
//     .catch((e) => {
//       console.log(e);
//       res.send("Delete failed.");
//     });
// });

//error handling
app.get("/*", (req, res) => {
  res.status(404);
  res.send("Not allowed.");
});

//listen
app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000/.");
});

/* 
routes
1. /students/instert
  a. get (html form) 
  b. post(data to mgdb)

2. /students 
  a.list all students

3. /students/:id  
  a.set student personal page

4. /students/edit/:id 
  a.get (html form) 
  b.put (update data)
  c. redirect to personal student page

5. /students/delete/:id
  a.delete request

others
1. put : 整筆資料替換掉 / patch : 部分替換
2. useFindAndModify 可不必加。 https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options
*/
