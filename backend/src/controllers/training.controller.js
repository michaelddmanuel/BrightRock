const { Training, User, Attendance } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

// Get all training sessions
exports.getAllTrainingSessions = async (req, res, next) => {
  try {
    const { status, startDate, endDate, isVirtual, isMandatory, search } = req.query;
    
    // Build filter conditions
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (startDate && endDate) {
      whereClause.startDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.startDate = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereClause.startDate = {
        [Op.lte]: new Date(endDate)
      };
    }
    
    if (isVirtual !== undefined) {
      whereClause.isVirtual = isVirtual === 'true';
    }
    
    if (isMandatory !== undefined) {
      whereClause.isMandatory = isMandatory === 'true';
    }
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
        { facilitatorName: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Get trainings with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const trainings = await Training.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['startDate', 'ASC']],
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(trainings.count / limit);
    
    res.status(200).json({
      success: true,
      data: trainings.rows,
      pagination: {
        totalItems: trainings.count,
        totalPages,
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get a single training session by ID
exports.getTrainingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const training = await Training.findByPk(id);
    
    if (!training) {
      throw ApiError.notFound('Training session not found');
    }
    
    res.status(200).json({
      success: true,
      data: training
    });
  } catch (error) {
    next(error);
  }
};

// Create a new training session
exports.createTraining = async (req, res, next) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      isVirtual,
      meetingLink,
      prerequisite,
      capacity,
      isMandatory,
      facilitatorName,
      facilitatorContact,
      vendorId
    } = req.body;
    
    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      throw ApiError.badRequest('End date must be after start date');
    }
    
    // Create training
    const training = await Training.create({
      title,
      description,
      startDate,
      endDate,
      location,
      isVirtual,
      meetingLink,
      prerequisite,
      capacity,
      isMandatory,
      facilitatorName,
      facilitatorContact,
      vendorId,
      status: 'scheduled'
    });
    
    res.status(201).json({
      success: true,
      data: training
    });
  } catch (error) {
    next(error);
  }
};

// Update a training session
exports.updateTraining = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      isVirtual,
      meetingLink,
      prerequisite,
      capacity,
      isMandatory,
      facilitatorName,
      facilitatorContact,
      vendorId,
      status
    } = req.body;
    
    // Find training
    const training = await Training.findByPk(id);
    
    if (!training) {
      throw ApiError.notFound('Training session not found');
    }
    
    // Validate dates if provided
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      throw ApiError.badRequest('End date must be after start date');
    }
    
    // Update training
    await training.update({
      title,
      description,
      startDate,
      endDate,
      location,
      isVirtual,
      meetingLink,
      prerequisite,
      capacity,
      isMandatory,
      facilitatorName,
      facilitatorContact,
      vendorId,
      status
    });
    
    res.status(200).json({
      success: true,
      data: training
    });
  } catch (error) {
    next(error);
  }
};

// Delete a training session
exports.deleteTraining = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find training
    const training = await Training.findByPk(id);
    
    if (!training) {
      throw ApiError.notFound('Training session not found');
    }
    
    // Check if there are any attendances for this training
    const attendances = await Attendance.count({ where: { TrainingId: id } });
    
    if (attendances > 0) {
      throw ApiError.badRequest('Cannot delete training with existing attendances. Consider cancelling it instead.');
    }
    
    // Delete training
    await training.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Training session deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get upcoming training sessions
exports.getUpcomingTrainings = async (req, res, next) => {
  try {
    const now = new Date();
    
    // Get trainings with start date in the future
    const trainings = await Training.findAll({
      where: {
        startDate: { [Op.gte]: now },
        status: 'scheduled'
      },
      order: [['startDate', 'ASC']],
      limit: 10
    });
    
    res.status(200).json({
      success: true,
      data: trainings
    });
  } catch (error) {
    next(error);
  }
};

// Get mandatory training sessions for a user
exports.getMandatoryTrainings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get all mandatory trainings
    const mandatoryTrainings = await Training.findAll({
      where: {
        isMandatory: true,
        status: 'scheduled',
        startDate: { [Op.gte]: new Date() }
      },
      order: [['startDate', 'ASC']]
    });
    
    // Get user's attendances for these trainings
    const trainingIds = mandatoryTrainings.map(training => training.id);
    const attendances = await Attendance.findAll({
      where: {
        UserId: userId,
        TrainingId: { [Op.in]: trainingIds }
      }
    });
    
    // Map attendance status to trainings
    const trainingsWithStatus = mandatoryTrainings.map(training => {
      const attendance = attendances.find(a => a.TrainingId === training.id);
      return {
        ...training.get(),
        attendanceStatus: attendance ? attendance.status : null,
        attendanceId: attendance ? attendance.id : null
      };
    });
    
    res.status(200).json({
      success: true,
      data: trainingsWithStatus
    });
  } catch (error) {
    next(error);
  }
};
