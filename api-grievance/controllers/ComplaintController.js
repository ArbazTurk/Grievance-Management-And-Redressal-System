const Upload = require("../upload.js");
const Complaint = require("../models/Complaint.js");
const User = require("../models/User.js");

let addComplaint = async (req, res) => {
  try {
    let newComplaint = new Complaint(req.body);
    newComplaint.communicationTimeStamps.push(new Date());
    if (req.file) {
      const upload = await Upload.uploadFile(req.file.path);
      newComplaint.document = upload.secure_url;
    }

    await newComplaint.save();

    res
      .status(200)
      .send({ success: true, message: "Complaint filed", data: newComplaint });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to file complaint", data: "" });
  }
};

let getComplaintsByGrievanceMember = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  try {
    const searchRegex = new RegExp(search, "i");
    const users = await User.find({
      $or: [{ firstName: searchRegex }, { lastName: searchRegex }],
    }).select("_id");
    const userIds = users.map((user) => user._id);
    const complaints = await Complaint.find({
      complaintRecipient: req.params.id,
      $or: [
        { complaintBy: { $in: userIds } },
        { category: searchRegex },
        { complaintStatus: searchRegex },
        { priority: searchRegex },
      ],
    })
      .populate("complaintBy", "firstName lastName")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ created_at: -1 })
      .exec();
    const count = await Complaint.countDocuments({
      complaintRecipient: req.params.id,
      $or: [
        { complaintBy: { $in: userIds } },
        { category: searchRegex },
        { complaintStatus: searchRegex },
        { priority: searchRegex },
      ],
    });
    res.json({
      complaints,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

let getComplaintsByUser = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  try {
    const searchRegex = new RegExp(search, "i");
    const users = await User.find({
      $or: [{ firstName: searchRegex }, { lastName: searchRegex }],
    }).select("_id");
    const userIds = users.map((user) => user._id);
    const complaints = await Complaint.find({
      complaintBy: req.params.id,
      $or: [
        { complaintRecipient: { $in: userIds } },
        { category: searchRegex },
        { complaintStatus: searchRegex },
        { priority: searchRegex },
      ],
    })
      .populate("complaintRecipient", "firstName lastName")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ created_at: -1 })
      .exec();
    const count = await Complaint.countDocuments({
      complaintBy: req.params.id,
      $or: [
        { complaintRecipient: { $in: userIds } },
        { category: searchRegex },
        { complaintStatus: searchRegex },
        { priority: searchRegex },
      ],
    });
    res.json({
      complaints,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

let getComplaints = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  try {
    const searchRegex = new RegExp(search, "i");
    const users = await User.find({
      $or: [{ firstName: searchRegex }, { lastName: searchRegex }],
    }).select("_id");
    const userIds = users.map((user) => user._id);
    const complaints = await Complaint.find({
      $or: [
        { complaintBy: { $in: userIds } },
        { complaintRecipient: { $in: userIds } },
        { category: searchRegex },
        { complaintStatus: searchRegex },
        { priority: searchRegex },
      ],
    })
      .populate("complaintBy", "firstName lastName")
      .populate("complaintRecipient", "firstName lastName")
      .sort({ created_at: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Complaint.countDocuments({
      $or: [
        { complaintBy: { $in: userIds } },
        { complaintRecipient: { $in: userIds } },
        { category: searchRegex },
        { complaintStatus: searchRegex },
        { priority: searchRegex },
      ],
    });
    res.json({
      complaints,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

let deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    res.status(200).json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

let getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("complaintRecipient", "firstName lastName")
      .populate("complaintBy", "firstName lastName");
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

let updateComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    if (req.file) {
      const upload = await Upload.uploadFile(req.file.path);
      complaint.document = upload.secure_url;
    }
    if (req.body.remarks) {
      complaint.remarks[0] = req.body.remarks;
      complaint.complaintStatus = "InProgress";
      complaint.communicationTimeStamps.push(new Date());
    } else {
      complaint.category = req.body.category || complaint.category;
      complaint.description[0] =
        req.body.description || complaint.description[0];
      complaint.priority = req.body.priority || complaint.priority;
      complaint.complaintStatus =
        req.body.complaintStatus || complaint.complaintStatus;
      complaint.rating = req.body.rating || complaint.rating;
    }
    await complaint.save();
    res.status(200).json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

let updateComplaintWithAppeal = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    complaint.description.push(req.body.appealMessage);
    complaint.communicationTimeStamps.push(new Date());
    complaint.complaintStatus = "Pending";
    await complaint.save();
    res.status(200).json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

let updateComplaintWithReply = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    complaint.remarks.push(req.body.replyMessage);
    complaint.communicationTimeStamps.push(new Date());
    complaint.complaintStatus = "InProgress";
    await complaint.save();
    res.status(200).json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

let getComplaintAnalytics = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      complaintRecipient: req.params.id,
    });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addComplaint,
  getComplaintsByGrievanceMember,
  getComplaintsByUser,
  getComplaints,
  deleteComplaint,
  getComplaintById,
  updateComplaintById,
  updateComplaintWithAppeal,
  updateComplaintWithReply,
  getComplaintAnalytics,
};
