const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamps");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  mobileNo: { type: String },
  profilePhoto: { type: String, default: '' },
  password: { type: String, required: true },
  userType: { type: Number, default: 1, enum: [1, 2, 3, 4] },   // 1=> Normal user, 2=> Gievence Member, 3=>, 4=>Admin 
  status: { type: String, default: "Active", enum: ["Active", "Disabled"] },
  profile: { type: String, default: 'Others' , enum: [ 'Dean Academics' , 'Director' , 'Deputy Director' , 'President','Others' ] },
  role: { type: String, default: 'Student' , enum: [ 'Student', 'Staff' ]},
  isVerified: { type: String, default: 'Not Verified', enum: ['Verified','Not Verified']},
  createdAt: Date,
  updatedAt: Date,
});

UserSchema.plugin(timestamps, { index: true });
module.exports = mongoose.model("User", UserSchema);
