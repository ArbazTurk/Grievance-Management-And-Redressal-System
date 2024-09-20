const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamps");
// const sequence = require('mongoose-sequence');

const ComplaintSchema = new mongoose.Schema({
  category: { type: String, required: true },
  complaintRecipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: [String], required: true },
  priority: { type: String, default: 'High', enum: ['High', 'Medium', 'Low'], required: true },
  complaintStatus: { type: String, required: true, default: 'Pending', enum: ['Pending', 'Withdraw', 'Resolved','InProgress'] },
  document: { type: String, default: '' },
  complaintBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  complaintId: { type: String, unique: true },
  remarks: { type: [String], default: [] },
  communicationTimeStamps: { type: [Date], required: true },
  anonymous: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  createdAt: Date,
  updatedAt: Date,
});


ComplaintSchema.plugin(timestamps, { index: true }); // timestamps: true can also be used if not want to control indexing

// Pre-save middleware to generate unique ComplaintId
ComplaintSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastComplaint = await mongoose
      .model("Complaint")
      .findOne()
      .sort({ created_at: -1 })
      .exec();
    const lastId = lastComplaint
      ? parseInt(lastComplaint.complaintId.replace("C00", ""))
      : 0;
    this.complaintId = `C00${lastId + 1}`;
  }
  next();
});

// ComplaintSchema.plugin(sequence, { incOnInsert: true, key: 'complaintId', prefix: 'C00' });
// ComplaintSchema.plugin(sequence, { inc_field: 'complaintId', id: 'complaintIdNums', start_seq: 1 });

const Complaint = mongoose.model("Complaint", ComplaintSchema);

module.exports = Complaint;
