const express = require("express");
const dotenv = require('dotenv');
const app = express();
const user = require('./routes/User');
const complaint = require("./routes/Complaint");
const connect = require("./connection");
const cors = require("cors");
// const bodyParser = require("body-parser");
const Admin = require("./routes/Admin.js");
const UserHelper = require('./helper/user.js');

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

connect();
UserHelper.createAdmin();
app.use(user);
app.use(complaint);
app.use(Admin)

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on ${process.env.PORT}....`);
  }
});