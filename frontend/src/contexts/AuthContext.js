import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Create authentication context
const AuthContext = createContext();

// Mock users for demo/testing purposes
const mockUsers = [
  {
    id: 'user1',
    username: 'datascientist',
    email: 'ds@brightrock.com',
    name: 'Data Scientist User',
    role: 'DS'
  },
  {
    id: 'user2',
    username: 'manager',
    email: 'manager@brightrock.com',
    name: 'Manager User',
    role: 'Manager'
  },
  {
    id: 'user3',
    username: 'executive',
    email: 'exec@brightrock.com',
    name: 'Executive User',
    role: 'Executive'
  },
  {
    id: 'user4',
    username: 'admin',
    email: 'admin@brightrock.com',
    name: 'Admin User',
    role: 'Admin'
  }
];

// Authentication provider component
export const AuthProvider = ({ children }) => {
  // Authentication state with localStorage initialization
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [selectedRole, setSelectedRole] = useState(() => localStorage.getItem('selectedRole') || '');
  const [isLoading, setIsLoading] = useState(false);
  
  // For navigation after authentication actions
  const navigate = useNavigate();
  
  // Check and log authentication state on any auth state change
  useEffect(() => {
    const authState = {
      hasToken: !!token,
      hasUser: !!currentUser,
      role: selectedRole
    };
    
    console.log('[AuthContext] Auth state updated:', authState);
    
  }, [token, currentUser, selectedRole]);
  
  // Secure set user function - updates both state and localStorage
  const secureSetUser = (user) => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
    } else {
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
    }
  };
  
  // Secure set token function - updates both state and localStorage
  const secureSetToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem('token');
      setToken(null);
    }
  };
  
  // Secure set role function - updates both state and localStorage
  const secureSetRole = (role) => {
    if (role) {
      localStorage.setItem('selectedRole', role);
      setSelectedRole(role);
    } else {
      localStorage.removeItem('selectedRole');
      setSelectedRole('');
    }
  };
  
  // Set user role function
  const setUserRole = (role) => {
    console.log('[AuthContext] Setting user role:', role);
    secureSetRole(role);
  };
  
  // Login function (mock for demo)
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would make an API call
      // For demo, find a matching mock user
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        console.error('[AuthContext] Login failed: Invalid credentials');
        return { success: false, message: 'Invalid credentials' };
      }
      
      // Create a token
      const mockToken = `demo-token-${Date.now()}`;
      
      // Use secure methods to update auth state
      secureSetToken(mockToken);
      secureSetUser(user);
      
      console.log('[AuthContext] Login successful:', { username: user.username, role: user.role });
      
      // Navigate to role selection
      navigate('/role-selection');
      
      return { success: true, user };
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    console.log('[AuthContext] Logging out user');
    
    // Clear auth data using secure methods
    secureSetToken(null);
    secureSetUser(null);
    secureSetRole(null);
    
    // Navigate to login
    console.log('[AuthContext] Redirecting to login page');
    navigate('/login');
  };
  
  // Register function (mock for demo)
  const register = async (userData) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would make an API call
      const newUser = {
        id: `user${Date.now()}`,
        ...userData
      };
      
      // Create a token
      const mockToken = `demo-token-${Date.now()}`;
      
      // Use secure methods to update auth state
      secureSetToken(mockToken);
      secureSetUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('[AuthContext] Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verify token function (mock for demo)
  const verifyToken = async () => {
    try {
      if (!token) return false;
      
      // In a real app, this would make an API call to verify the token
      return true;
    } catch (error) {
      console.error('[AuthContext] Token verification error:', error);
      return false;
    }
  };
  
  // Check authentication status
  const checkAuthStatus = () => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('selectedRole');
    const storedUser = localStorage.getItem('currentUser');
    
    const authStatus = {
      isAuthenticated: !!storedToken,
      hasRole: !!storedRole,
      hasUser: !!storedUser,
      role: storedRole || '',
      token: storedToken || null,
      user: storedUser ? JSON.parse(storedUser) : null
    };
    
    console.log('[AuthContext] Auth status check:', authStatus);
    
    return authStatus;
  };
  
  // Direct access function for quick demo access
  const directAccess = (role) => {
    try {
      console.log(`[AuthContext] Direct access requested for role: ${role}`);
      
      // Find a mock user with this role
      const user = mockUsers.find(u => u.role === role);
      
      if (!user) {
        console.error(`[AuthContext] No user found with role ${role}`);
        return { success: false, message: `No user found with role ${role}` };
      }
      
      console.log(`[AuthContext] Found user for role ${role}:`, user);
      
      // Create a mock token
      const mockToken = `demo-access-token-${role}-${Date.now()}`;
      
      // Use secure methods to update auth state
      secureSetToken(mockToken);
      secureSetUser(user);
      secureSetRole(role);
      
      // Verify data was set correctly
      const storedToken = localStorage.getItem('token');
      const storedRole = localStorage.getItem('selectedRole');
      const storedUser = localStorage.getItem('currentUser');
      
      const verified = {
        token: !!storedToken,
        role: storedRole === role,
        user: !!storedUser
      };
      
      console.log('[AuthContext] Verification of direct access setup:', verified);
      
      if (!verified.token || !verified.role || !verified.user) {
        console.error('[AuthContext] Failed to set up direct access properly');
        return { success: false, message: 'Failed to set up direct access properly' };
      }
      
      return { 
        success: true, 
        user, 
        role, 
        token: mockToken,
        redirectUrl: role === 'DS' ? '/dashboard/ds' : 
                     role === 'Manager' ? '/dashboard/manager' : 
                     role === 'Executive' ? '/dashboard/executive' : 
                     role === 'Admin' ? '/admin/dashboard' : 
                     '/role-selection'
      };
    } catch (error) {
      console.error('[AuthContext] Error in directAccess:', error);
      return { success: false, message: error.message || 'Failed to access demo portal' };
    }
  };
  
  // Context value
  const value = {
    currentUser,
    token,
    isLoading,
    selectedRole,
    login,
    logout,
    register,
    verifyToken,
    setUserRole,
    directAccess,
    checkAuthStatus
  };
  
  // Provider component that will wrap the app and provide the authentication context
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
