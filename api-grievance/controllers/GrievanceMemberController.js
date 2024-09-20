const User = require("../models/User");
let bcrypt = require("bcrypt");
let saltRounds = 10;
// const jwt = require("jsonwebtoken");
// const SECRET_KEY = "b2Vfb3ZlcnRoZXJlX29yX3NvbWV0aGluZ19lbHNld2hlcmU";

const GrievanceMemberController = {
  async addGrievanceMember(req, res) {
    try {
      const { email, password } = req.body;
      let existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).send("Grievance Member Already Exists...");
      }
  
      let newUser = new User({
        ...req.body,
        isVerified: 'Verified',
        password: bcrypt.hashSync(password, saltRounds),
      });
  
      await newUser.save();
  
      res.status(201).send({
        success: true,
        message: "Grievance Member Added Successfully",
        data: newUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Grievance Member Creation Failed",
        data: "",
      });
    }},

  async getAllGrievanceMembers(req, res) {
    const { page = 1, limit = 10, search = "" } = req.query;
    try {
      const users = await User.find({
        userType: 2,
        $or: [
          { firstName: new RegExp(search, "i") },
          { lastName: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
          { mobileNo: new RegExp(search, 'i') },
          { profile: new RegExp(search, 'i') },
          { status: new RegExp(search, 'i') },
        ],
      })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const count = await User.countDocuments({
        userType: 2,
        $or: [
          { firstName: new RegExp(search, "i") },
          { lastName: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
          { mobileNo: new RegExp(search, 'i') },
          { profile: new RegExp(search, 'i') },
          { status: new RegExp(search, 'i') },
        ],
      });

      res.send({
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getGrievanceMembers(req, res) {
    try {
      const grievanceMembers = await User.find({ userType: 2 });
      res.status(200).send({ success: true, message: "Grievance Members fetched successfully", data: grievanceMembers });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  

  async getGrievanceMemberById(req, res) {
    try {
      const member = await User.findById(req.params.id);
      if (!member) {
        return res.status(404).json({ error: "Grievance Member not found" });
      }
      res.status(200).json(member);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateGrievanceMemberById(req, res) {
    try {
      const updatedMember = await User.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );
      res.json(updatedMember);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = GrievanceMemberController;
