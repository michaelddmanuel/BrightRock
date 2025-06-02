// Mock API service for development and testing
import { v4 as uuidv4 } from 'uuid';

// Mock user database
const users = [
  {
    id: '1',
    email: 'admin@sasol.com',
    password: 'Admin@123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    department: 'ESD',
    employeeId: 'SA001',
    phoneNumber: '+27123456789'
  },
  {
    id: '2',
    email: 'trainer@sasol.com',
    password: 'Trainer@123',
    firstName: 'Training',
    lastName: 'Manager',
    role: 'trainer',
    department: 'Training',
    employeeId: 'SA002',
    phoneNumber: '+27123456790'
  },
  {
    id: '3',
    email: 'user@sasol.com',
    password: 'User@123',
    firstName: 'Regular',
    lastName: 'User',
    role: 'user',
    department: 'Operations',
    employeeId: 'SA003',
    phoneNumber: '+27123456791'
  }
];

// Generate a JWT-like token (not real JWT, just for mock purposes)
const generateToken = (userId) => {
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

// Mock auth endpoints
const auth = {
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          const token = generateToken(user.id);
          // Create a safe user object without password
          const { password, ...userWithoutPassword } = user;
          
          resolve({
            data: {
              token,
              user: userWithoutPassword
            }
          });
        } else {
          reject({
            response: {
              data: {
                message: 'Invalid email or password'
              }
            }
          });
        }
      }, 800); // Simulate network delay
    });
  },
  
  me: (token) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!token || !token.startsWith('mock-jwt-token-')) {
          reject({
            response: {
              status: 401,
              data: {
                message: 'Unauthorized'
              }
            }
          });
          return;
        }
        
        // Extract user ID from token
        const userId = token.split('-')[3];
        const user = users.find(u => u.id === userId);
        
        if (user) {
          // Create a safe user object without password
          const { password, ...userWithoutPassword } = user;
          resolve({
            data: {
              user: userWithoutPassword
            }
          });
        } else {
          reject({
            response: {
              status: 401,
              data: {
                message: 'User not found'
              }
            }
          });
        }
      }, 500); // Simulate network delay
    });
  }
};

// Interceptor implementation
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  use(fulfilled, rejected) {
    const id = this.handlers.length;
    this.handlers.push({
      fulfilled,
      rejected,
      id
    });
    return id;
  }

  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  forEach(fn) {
    this.handlers.forEach(handler => {
      if (handler !== null) {
        fn(handler);
      }
    });
  }
}

// Mock API service
const mockApi = {
  get: (url) => {
    if (url === '/api/auth/me') {
      const token = localStorage.getItem('token');
      return auth.me(token);
    }
    
    return Promise.reject(new Error(`No mock implementation for GET ${url}`));
  },
  
  post: (url, data) => {
    if (url === '/api/auth/login') {
      return auth.login(data.email, data.password);
    }
    
    return Promise.reject(new Error(`No mock implementation for POST ${url}`));
  },

  interceptors: {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  },

  defaults: {
    headers: {
      common: {}
    }
  }
};

export default mockApi;
