const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController.js");
// router.use(express.json());
// router.use(express.urlencoded({ extended: false }));
// const upload = multer({ dest: 'uploads/' });
const multer = require("multer");
const auth = require("../middleware/auth.js");
// const bodyParser = require("body-parser");
// const path = require("path");

// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(express.static(path.resolve(__dirname, "public")));

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
