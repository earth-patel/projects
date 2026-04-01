import { createBrowserRouter, Navigate } from 'react-router';

import ProtectedLayout from '../layouts/ProtectedLayout';
import PublicLayout from '../layouts/PublicLayout';
import AcceptInvite from '../pages/AcceptInvite';
import Dashboard from '../pages/Dashboard';
import ForgotPassword from '../pages/ForgotPassword';
import Login from '../pages/Login';
import Members from '../pages/Members';
import NotFound from '../pages/NotFound';
import OrganizationSelection from '../pages/OrganizationSelection';
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
      {
        element: <PublicLayout />,
        children: [
          { path: '/login', element: <Login /> },
          { path: '/register', element: <Register /> },
          { path: '/verify-email', element: <VerifyEmail /> },
          { path: '/forgot-password', element: <ForgotPassword /> },
          { path: '/reset-password', element: <ResetPassword /> }
        ]
      }
    ]
  },
  // Protected Routes
  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: '/organization-selection',
            element: <OrganizationSelection />
          },
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/dashboard/members', element: <Members /> },
        ]
      }
    ]
  },
  // accessible to both authenticated and unauthenticated users
  {
    element: <PublicLayout />,
    children: [{ path: '/accept-invite', element: <AcceptInvite /> }]
  },
  // Fallback Route
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;
