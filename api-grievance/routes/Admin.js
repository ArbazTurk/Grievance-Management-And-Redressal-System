const express = require('express');
const router = express.Router();
const GrievanceMemberController = require('../controllers/GrievanceMemberController');
const auth = require('../middleware/auth');

router.post('/add/grievance-member', auth, GrievanceMemberController.addGrievanceMember);
router.get('/list/grievance-members', auth, GrievanceMemberController.getAllGrievanceMembers);
router.get('/get/grievance-members', auth, GrievanceMemberController.getGrievanceMembers);
router.get('/get/grievance-member/:id', auth, GrievanceMemberController.getGrievanceMemberById);
router.put('/update/grievance-member/:id', auth, GrievanceMemberController.updateGrievanceMemberById);

module.exports = router;
