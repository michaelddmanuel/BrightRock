import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { useAuth } from './contexts/AuthContext';

// Layouts
import AuthLayout from './components/layouts/AuthLayout';
import MainLayout from './components/layouts/MainLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import RoleSelectionPage from './pages/auth/RoleSelectionPage';

// User Pages
import DashboardPage from './pages/user/DashboardPage';
import TrainingListPage from './pages/user/TrainingListPage';
import TrainingDetailPage from './pages/user/TrainingDetailPage';
import AttendanceFormPage from './pages/user/AttendanceFormPage';
import MyAttendancePage from './pages/user/MyAttendancePage';

// Role-based Dashboard Pages
import DSDashboard from './pages/dashboards/DSDashboard';
import ManagerDashboard from './pages/dashboards/ManagerDashboard';
import ExecutiveDashboard from './pages/dashboards/ExecutiveDashboard';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import TrainingManagementPage from './pages/admin/TrainingManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ReportsAnalyticsPage from './pages/admin/ReportsAnalyticsPage';

// Other Pages
import NotFoundPage from './pages/NotFoundPage';

// Protected route component with enhanced auth checking
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { checkAuthStatus } = useAuth();
  const location = useLocation();
  
  // Use improved auth status check
  const authStatus = checkAuthStatus();
  
  console.log('ProtectedRoute - Path:', location.pathname);
  console.log('ProtectedRoute - Auth Status:', { 
    isAuthenticated: authStatus.isAuthenticated,
    hasRole: authStatus.hasRole,
    role: authStatus.role,
    requiredRoles
  });
  
  // Check authentication first
  if (!authStatus.isAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    // Force a full page reload to clear any state
    window.location.href = '/login';
    return null;
  }
  
  // Then check role if needed - only if requiredRoles has items
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(authStatus.role);
    
    // If the path contains /dashboard/, allow access regardless of role
    const isDashboardRoute = location.pathname.includes('/dashboard/');
    
    if (!isDashboardRoute && (!authStatus.hasRole || !hasRequiredRole)) {
      console.log(`ProtectedRoute - Role ${authStatus.role} not authorized for this route, required: ${requiredRoles.join(', ')}`);
      // Force a full page reload to clear any state
      window.location.href = '/role-selection';
      return null;
    }
  }
  
  return children;
};

// Smart component to handle root path redirections based on auth status
const DefaultRedirect = () => {
  const { checkAuthStatus } = useAuth();
  const authStatus = checkAuthStatus();
  
  console.log('[DefaultRedirect] Checking where to redirect based on auth status:', authStatus);
  
  // If not authenticated, go to login
  if (!authStatus.isAuthenticated) {
    console.log('[DefaultRedirect] Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated but no role selected, go to role selection
  if (!authStatus.hasRole) {
    console.log('[DefaultRedirect] Authenticated but no role, redirecting to role selection');
    return <Navigate to="/role-selection" replace />;
  }
  
  // If authenticated with role, redirect to the appropriate dashboard
  const roleMap = {
    'DS': '/dashboard/ds',
    'Manager': '/dashboard/manager',
    'Executive': '/dashboard/executive',
    'Admin': '/admin/dashboard'
  };
  
  const dashboardPath = roleMap[authStatus.role] || '/role-selection';
  console.log(`[DefaultRedirect] Authenticated with role ${authStatus.role}, redirecting to ${dashboardPath}`);
  return <Navigate to={dashboardPath} replace />;
};

function App() {
  const token = localStorage.getItem('token');
  
  return (
    <Box minH="100vh">
      <Routes>
        {/* Auth routes - no longer using AuthLayout since our login page has its own layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        
        {/* New Role-Based Routes */}
        <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          {/* Default redirect to login, role selection, or appropriate dashboard based on authentication status */}
          <Route path="/" element={<DefaultRedirect />} />
          
          {/* Dashboards */}
          <Route path="/dashboard">
            <Route path="ds" element={
              <ProtectedRoute requiredRoles={[]}>
                <DSDashboard />
              </ProtectedRoute>
            } />
            <Route path="manager" element={
              <ProtectedRoute requiredRoles={[]}>
                <ManagerDashboard />
              </ProtectedRoute>
            } />
            <Route path="executive" element={
              <ProtectedRoute requiredRoles={[]}>
                <ExecutiveDashboard />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Legacy route redirects */}
          <Route path="/ds-dashboard" element={<Navigate to="/dashboard/ds" replace />} />
          <Route path="/manager-dashboard" element={<Navigate to="/dashboard/manager" replace />} />
          <Route path="/executive-dashboard" element={<Navigate to="/dashboard/executive" replace />} />
          <Route path="/dashboard" element={<Navigate to="/role-selection" replace />} />
          
          {/* Other routes */}
          <Route path="/trainings" element={<TrainingListPage />} />
          <Route path="/trainings/:id" element={<TrainingDetailPage />} />
          <Route path="/attendance" element={<MyAttendancePage />} />
          <Route path="/attendance/:id" element={<AttendanceFormPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRoles={['admin', 'esd_admin']}>
              <Navigate to="/admin/dashboard" replace />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRoles={['admin', 'esd_admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/trainings" element={
            <ProtectedRoute requiredRoles={['admin', 'esd_admin']}>
              <TrainingManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRoles={['admin', 'esd_admin']}>
              <UserManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute requiredRoles={['admin', 'esd_admin']}>
              <ReportsAnalyticsPage />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Box>
  );
}

export default App;
