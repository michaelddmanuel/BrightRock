import api from './api';

/**
 * Service for handling user-related API requests
 */
const userService = {
  /**
   * Get all users (admin only)
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getAllUsers: async (params = {}) => {
    return api.get('/api/users', { params });
  },
  
  /**
   * Get a specific user by ID
   * @param {string} id - User ID
   * @returns {Promise} - API response
   */
  getUserById: async (id) => {
    return api.get(`/api/users/${id}`);
  },
  
  /**
   * Create a new user (admin only)
   * @param {Object} userData - User data
   * @returns {Promise} - API response
   */
  createUser: async (userData) => {
    return api.post('/api/users', userData);
  },
  
  /**
   * Update an existing user
   * @param {string} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} - API response
   */
  updateUser: async (id, userData) => {
    return api.put(`/api/users/${id}`, userData);
  },
  
  /**
   * Delete a user (admin only)
   * @param {string} id - User ID
   * @returns {Promise} - API response
   */
  deleteUser: async (id) => {
    return api.delete(`/api/users/${id}`);
  },
  
  /**
   * Change user password
   * @param {string} id - User ID
   * @param {Object} passwordData - Password data
   * @returns {Promise} - API response
   */
  changePassword: async (id, passwordData) => {
    return api.put(`/api/users/${id}/password`, passwordData);
  },
  
  /**
   * Get current user profile
   * @returns {Promise} - API response
   */
  getProfile: async () => {
    return api.get('/api/users/profile');
  },
  
  /**
   * Update current user profile
   * @param {Object} profileData - Profile data
   * @returns {Promise} - API response
   */
  updateProfile: async (profileData) => {
    return api.put('/api/users/profile', profileData);
  }
};

export default userService;
