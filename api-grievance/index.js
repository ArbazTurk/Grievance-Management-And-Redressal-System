require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connect = require("./connection.js");
const UserHelper = require("./helper/user.js");
const user = require("./routes/User.js");
const complaint = require("./routes/Complaint.js");
const admin = require("./routes/Admin.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connect();
UserHelper.createAdmin();

app.use("/user", user);
app.use("/complaint", complaint);
app.use("/admin", admin);

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on ${process.env.PORT}....`);
  }
});