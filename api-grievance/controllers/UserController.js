const Upload = require("../upload.js");
let User = require("../models/User.js");
let bcrypt = require("bcrypt");
let saltRounds = 10;
const jwt = require("jsonwebtoken");

let signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send("User Already Exists...");
    }

    let newUser = new User({
      ...req.body,
      password: bcrypt.hashSync(password, saltRounds),
    });

    await newUser.save();

    res.status(200).send({
      success: true,
      message: "User Created Successfully",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "User Creation Failed",
      data: "",
    });
  }
};

let login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h"
    });
    res.send({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

let getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  try {
    const users = await User.find({
      userType: 1,
      $or: [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { mobileNo: new RegExp(search, "i") },
        { status: new RegExp(search, "i") },
        { isVerified: new RegExp(`^${search}`, "i") },
      ],
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.countDocuments({
      userType: 1,
      $or: [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { mobileNo: new RegExp(search, "i") },
        { status: new RegExp(search, "i") },
        { isVerified: new RegExp(`^${search}`, "i") },
      ],
    });

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

let getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

let updateUserById = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status,
        isVerified: req.body.isVerified
       },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

let changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    const hashedNewPassword = await bcrypt.hashSync(newPassword, saltRounds);
    user.password = hashedNewPassword;

    await user.save();
    res.status(200).json({ message: "Password changed successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

let updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.file) {
      const upload = await Upload.uploadFile(req.file.path);
      user.profilePhoto = upload.secure_url;
    }

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.mobileNo = req.body.mobileNo || user.mobileNo;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUserById,
  changePassword,
  updateUser,
};
