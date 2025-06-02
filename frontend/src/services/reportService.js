import api from './api';

/**
 * Service for handling report-related API requests
 */
const reportService = {
  /**
   * Get dashboard statistics
   * @returns {Promise} - API response
   */
  getDashboardStats: async () => {
    return api.get('/api/reports/dashboard');
  },
  
  /**
   * Get attendance statistics
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getAttendanceStats: async (params = {}) => {
    return api.get('/api/reports/attendance', { params });
  },
  
  /**
   * Get training statistics
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getTrainingStats: async (params = {}) => {
    return api.get('/api/reports/trainings', { params });
  },
  
  /**
   * Get user statistics
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getUserStats: async (params = {}) => {
    return api.get('/api/reports/users', { params });
  },
  
  /**
   * Generate a custom report
   * @param {Object} reportConfig - Report configuration
   * @returns {Promise} - API response
   */
  generateCustomReport: async (reportConfig) => {
    return api.post('/api/reports/custom', reportConfig);
  },
  
  /**
   * Export data to CSV
   * @param {string} reportType - Report type
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  exportToCSV: async (reportType, params = {}) => {
    return api.get(`/api/reports/export/${reportType}`, {
      params,
      responseType: 'blob'
    });
  },
  
  /**
   * Export data to PDF
   * @param {string} reportType - Report type
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  exportToPDF: async (reportType, params = {}) => {
    return api.get(`/api/reports/export/${reportType}/pdf`, {
      params,
      responseType: 'blob'
    });
  }
};

export default reportService;
