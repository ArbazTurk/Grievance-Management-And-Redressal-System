let User = require("../models/User.js");
let bcrypt = require("bcrypt");

const createAdmin = async (req, res) => {
  try {
    let user = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!user) {
      user = new User();
      user.firstName = process.env.ADMIN_FIRST_NAME;
      user.lastName = process.env.ADMIN_LAST_NAME;
      user.email = process.env.ADMIN_EMAIL;
      user.mobileNo = process.env.ADMIN_MOBILE_NO;
      user.password = bcrypt.hashSync(process.env.ADMIN_PASSWORD, parseInt(process.env.SALT_ROUNDS));
      user.userType = parseInt(process.env.ADMIN_USER_TYPE);
      user.isVerified = process.env.ADMIN_VERIFIED_STATUS;

      user = await user.save();
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  createAdmin
};