import axios from 'axios';
import mockApi from './mockApi';

// Determine if we should use mockApi
const useMockApi = true; // Set to true for mock API, false for real API

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header if token exists
const token = localStorage.getItem('token');
if (token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Choose the API to use
const api = useMockApi ? mockApi : axiosInstance;

export default api;
