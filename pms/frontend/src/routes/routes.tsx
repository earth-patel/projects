import { createBrowserRouter, Navigate } from 'react-router';

import Dashboard from '../pages/Dashboard';
import ForgotPassword from '../pages/ForgotPassword';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Register from '../pages/Register';
import ResetPassword from '../pages/ResetPassword';
import VerifyEmail from '../pages/VerifyEmail';
import ProtectedRoutes from './protectedRoutes';
import PublicRoutes from './publicRoutes';

const router = createBrowserRouter([
  // Root Redirect (let public route handle this redirection)
  {
    index: true,
    element: <Navigate to="/login" replace />
  },
  // Public Routes
  {
    element: <PublicRoutes />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/verify-email', element: <VerifyEmail /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> }
    ]
  },
  // Protected Routes
  {
    element: <ProtectedRoutes />,
    children: [{ path: '/dashboard', element: <Dashboard /> }]
  },
  // Fallback Route
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;
