const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController.js");
const multer = require("multer");
const auth = require("../middleware/auth.js");

const uploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/signup", (req, res) => {
  UserController.signup(req, res);
});

router.post("/login", (req, res) => {
  UserController.login(req, res);
});

router.post("/verify-email", (req, res) => {
  UserController.verifyEmail(req, res);
});

router.post("/forgot-password", (req, res) => {
  UserController.forgotPassword(req, res);
});

router.post("/reset-password", (req, res) => {
  UserController.resetPassword(req, res);
});

router.get("/users", auth, (req, res) => {
  UserController.getAllUsers(req, res);
});

router.get("/get/user/:id", auth, (req, res) => {
  UserController.getUserById(req, res);
});

router.put("/update/user/:id", auth, (req, res) => {
  UserController.updateUserById(req, res);
});

router.put("/change/password/:id", auth, (req, res) => {
  UserController.changePassword(req, res);
});

router.put(
  "/edit/user-profile/:id",
  auth,
  uploader.single("file"),
  (req, res) => {
    UserController.updateUser(req, res);
  }
);

module.exports = router;
