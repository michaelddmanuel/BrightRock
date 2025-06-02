import api from './api';

/**
 * Service for handling training-related API requests
 */
const trainingService = {
  /**
   * Get all trainings
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getAllTrainings: async (params = {}) => {
    return api.get('/api/trainings', { params });
  },
  
  /**
   * Get a specific training by ID
   * @param {string} id - Training ID
   * @returns {Promise} - API response
   */
  getTrainingById: async (id) => {
    return api.get(`/api/trainings/${id}`);
  },
  
  /**
   * Create a new training
   * @param {Object} trainingData - Training data
   * @returns {Promise} - API response
   */
  createTraining: async (trainingData) => {
    return api.post('/api/trainings', trainingData);
  },
  
  /**
   * Update an existing training
   * @param {string} id - Training ID
   * @param {Object} trainingData - Updated training data
   * @returns {Promise} - API response
   */
  updateTraining: async (id, trainingData) => {
    return api.put(`/api/trainings/${id}`, trainingData);
  },
  
  /**
   * Delete a training
   * @param {string} id - Training ID
   * @returns {Promise} - API response
   */
  deleteTraining: async (id) => {
    return api.delete(`/api/trainings/${id}`);
  },
  
  /**
   * Get attendance for a specific training
   * @param {string} id - Training ID
   * @returns {Promise} - API response
   */
  getTrainingAttendance: async (id) => {
    return api.get(`/api/trainings/${id}/attendance`);
  },
  
  /**
   * Record attendance for a specific training
   * @param {string} id - Training ID
   * @param {Object} attendanceData - Attendance data
   * @returns {Promise} - API response
   */
  recordAttendance: async (id, attendanceData) => {
    return api.post(`/api/trainings/${id}/attendance`, attendanceData);
  }
};

export default trainingService;
