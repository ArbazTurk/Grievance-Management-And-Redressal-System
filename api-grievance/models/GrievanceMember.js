const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GrievanceMemberSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNo: { type: String },
  profile: { type: String, default: 'DeanAcademics' , enum: [ 'Dean Academics' , 'Director' , 'Deputy Director' , 'President','Others' ] },
  status: { type: String, default: 'Active', enum: [ 'Active' , 'Disabled' ] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

GrievanceMemberSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const GrievanceMember = mongoose.model('GrievanceMember', GrievanceMemberSchema);

module.exports = GrievanceMember;