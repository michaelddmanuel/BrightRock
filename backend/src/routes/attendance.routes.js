const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

// Routes accessible to all authenticated users
router.post('/register', attendanceController.registerForTraining);
router.post('/check-in', attendanceController.checkInToTraining);
router.post('/declaration', attendanceController.submitDeclaration);
router.get('/user', attendanceController.getUserAttendances);

// Routes accessible only to admins and facilitators
router.get('/training/:trainingId', authorize('admin', 'esd_admin', 'facilitator'), 
  attendanceController.getTrainingAttendances);
router.post('/manual', authorize('admin', 'esd_admin', 'facilitator'), 
  attendanceController.markAttendanceManually);
router.get('/qr-code/:trainingId', authorize('admin', 'esd_admin', 'facilitator'), 
  attendanceController.generateAttendanceQrCode);

module.exports = router;
