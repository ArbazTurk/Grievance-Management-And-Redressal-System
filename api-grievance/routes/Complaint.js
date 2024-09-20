const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/ComplaintController");
const multer = require("multer");
const auth = require("../middleware/auth");
// const bodyParser = require("body-parser");
// const path = require("path");

// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(express.static(path.resolve(__dirname, "public")));

const uploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/complaintAdd", auth, uploader.single("file"), (req, res) => {
  complaintController.addComplaint(req, res);
});

router.get("/get/complaints", auth, (req, res) => {
  complaintController.getComplaints(req, res);
});

router.delete("/delete/complaint/:id", auth, (req, res) => {
  complaintController.deleteComplaint(req, res);
});

router.get("/:id/complaints", auth, (req, res) => {
  if (req.query.type == "user") {
    complaintController.getComplaintsByUser(req, res);
  } else {
    complaintController.getComplaintsByGrievanceMember(req, res);
  }
});

router.get("/get/complaint/:id", auth, (req, res) => {
  complaintController.getComplaintById(req, res);
});

router.put("/update/complaint/:id", auth, uploader.single("file"), (req, res) => {
  complaintController.updateComplaintById(req, res);
});

router.put("/update/complaint/:id/appeal", auth, (req, res) => {
  complaintController.updateComplaintWithAppeal(req, res);
});
router.put("/update/complaint/:id/reply", auth, (req, res) => {
  complaintController.updateComplaintWithReply(req, res);
});

router.get("/:id/complaint/analytics", auth, (req, res) => {
  complaintController.getComplaintAnalytics(req, res);
})

module.exports = router;
