const { Attendance, Declaration, Training, User } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const { sendNotification } = require('../services/notification.service');

// Register for a training session
exports.registerForTraining = async (req, res, next) => {
  try {
    const { trainingId } = req.body;
    const userId = req.user.id;
    
    // Check if training exists
    const training = await Training.findByPk(trainingId);
    if (!training) {
      throw ApiError.notFound('Training session not found');
    }
    
    // Check if training is in the future
    if (new Date(training.startDate) < new Date()) {
      throw ApiError.badRequest('Cannot register for past training sessions');
    }
    
    // Check if training is at capacity
    if (training.capacity) {
      const attendanceCount = await Attendance.count({ where: { TrainingId: trainingId } });
      if (attendanceCount >= training.capacity) {
        throw ApiError.badRequest('Training session is at full capacity');
      }
    }
    
    // Check if user is already registered
    const existingAttendance = await Attendance.findOne({
      where: { UserId: userId, TrainingId: trainingId }
    });
    
    if (existingAttendance) {
      throw ApiError.badRequest('You are already registered for this training session');
    }
    
    // Create attendance record
    const attendance = await Attendance.create({
      UserId: userId,
      TrainingId: trainingId,
      status: 'registered'
    });
    
    // Send registration confirmation
    const user = await User.findByPk(userId);
    await sendNotification({
      type: 'email',
      to: user.email,
      subject: `Registration Confirmation: ${training.title}`,
      template: 'training-registration',
      data: {
        userName: `${user.firstName} ${user.lastName}`,
        trainingTitle: training.title,
        trainingDate: new Date(training.startDate).toLocaleDateString(),
        trainingTime: new Date(training.startDate).toLocaleTimeString(),
        trainingLocation: training.location || 'Virtual',
        trainingLink: training.isVirtual ? training.meetingLink : null
      }
    });
    
    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

// Check in to a training session
exports.checkInToTraining = async (req, res, next) => {
  try {
    const { trainingId, method } = req.body;
    const userId = req.user.id;
    
    // Check if training exists
    const training = await Training.findByPk(trainingId);
    if (!training) {
      throw ApiError.notFound('Training session not found');
    }
    
    // Find attendance record
    let attendance = await Attendance.findOne({
      where: { UserId: userId, TrainingId: trainingId }
    });
    
    // If no existing record, create one (for on-the-spot registrations)
    if (!attendance) {
      attendance = await Attendance.create({
        UserId: userId,
        TrainingId: trainingId,
        status: 'registered'
      });
    }
    
    // Update check-in time and method
    attendance.checkInTime = new Date();
    attendance.attendanceMethod = method || 'manual';
    attendance.status = 'attended';
    await attendance.save();
    
    res.status(200).json({
      success: true,
      data: attendance,
      message: 'Check-in successful'
    });
  } catch (error) {
    next(error);
  }
};

// Submit declaration form
exports.submitDeclaration = async (req, res, next) => {
  try {
    const { attendanceId, content, signature } = req.body;
    
    // Check if attendance record exists
    const attendance = await Attendance.findOne({
      where: { id: attendanceId, UserId: req.user.id },
      include: [{ model: Training }]
    });
    
    if (!attendance) {
      throw ApiError.notFound('Attendance record not found');
    }
    
    // Check if declaration already exists
    const existingDeclaration = await Declaration.findOne({
      where: { AttendanceId: attendanceId }
    });
    
    if (existingDeclaration) {
      throw ApiError.badRequest('Declaration form has already been submitted');
    }
    
    // Create declaration record
    const declaration = await Declaration.create({
      AttendanceId: attendanceId,
      content,
      signature,
      submittedAt: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    // Update attendance status if not already attended
    if (attendance.status !== 'attended') {
      attendance.status = 'attended';
      attendance.checkInTime = attendance.checkInTime || new Date();
      attendance.attendanceMethod = 'self-declared';
      await attendance.save();
    }
    
    res.status(201).json({
      success: true,
      data: declaration,
      message: 'Declaration form submitted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance records for a user
exports.getUserAttendances = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const attendances = await Attendance.findAll({
      where: { UserId: userId },
      include: [
        { model: Training },
        { model: Declaration }
      ],
      order: [[Training, 'startDate', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: attendances
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance records for a training session (admin only)
exports.getTrainingAttendances = async (req, res, next) => {
  try {
    const { trainingId } = req.params;
    
    // Check if training exists
    const training = await Training.findByPk(trainingId);
    if (!training) {
      throw ApiError.notFound('Training session not found');
    }
    
    const attendances = await Attendance.findAll({
      where: { TrainingId: trainingId },
      include: [
        { 
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'companyName'] 
        },
        { model: Declaration }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: attendances
    });
  } catch (error) {
    next(error);
  }
};

// Mark attendance manually (admin only)
exports.markAttendanceManually = async (req, res, next) => {
  try {
    const { trainingId, userId, status, notes } = req.body;
    
    // Find or create attendance record
    let attendance = await Attendance.findOne({
      where: { UserId: userId, TrainingId: trainingId }
    });
    
    if (!attendance) {
      attendance = await Attendance.create({
        UserId: userId,
        TrainingId: trainingId,
        status: 'registered'
      });
    }
    
    // Update attendance status
    attendance.status = status;
    attendance.notes = notes;
    attendance.verifiedBy = req.user.id;
    attendance.verifiedAt = new Date();
    
    if (status === 'attended' && !attendance.checkInTime) {
      attendance.checkInTime = new Date();
      attendance.attendanceMethod = 'manual';
    }
    
    await attendance.save();
    
    res.status(200).json({
      success: true,
      data: attendance,
      message: 'Attendance marked successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Generate QR code for attendance (to be implemented)
exports.generateAttendanceQrCode = async (req, res, next) => {
  try {
    const { trainingId } = req.params;
    
    // Check if training exists
    const training = await Training.findByPk(trainingId);
    if (!training) {
      throw ApiError.notFound('Training session not found');
    }
    
    // Generate QR code (implementation would go here)
    // This would typically create a unique token for the training session
    // and generate a QR code that encodes this token
    
    res.status(200).json({
      success: true,
      data: {
        trainingId,
        qrCode: 'QR Code data would be here',
        expiresAt: new Date(Date.now() + 86400000) // 24 hours from now
      }
    });
  } catch (error) {
    next(error);
  }
};
