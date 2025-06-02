const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/training.controller');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

// Routes accessible to all authenticated users
router.get('/upcoming', trainingController.getUpcomingTrainings);
router.get('/mandatory', trainingController.getMandatoryTrainings);
router.get('/:id', trainingController.getTrainingById);

// Routes accessible only to admins and ESD administrators
router.get('/', authorize('admin', 'esd_admin'), trainingController.getAllTrainingSessions);
router.post('/', authorize('admin', 'esd_admin'), trainingController.createTraining);
router.put('/:id', authorize('admin', 'esd_admin'), trainingController.updateTraining);
router.delete('/:id', authorize('admin', 'esd_admin'), trainingController.deleteTraining);

module.exports = router;
