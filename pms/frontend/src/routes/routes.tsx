import { createBrowserRouter, Navigate } from 'react-router';

import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import Register from '../pages/Register';
import ProtectedRoutes from './protectedRoutes';
import PublicRoutes from './publicRoutes';

const router = createBrowserRouter([
  // Root Redirect (let public route handle this redirection)
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  // Public Routes
  {
    element: <PublicRoutes />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> }
    ]
  },
  // Protected Routes
  {
    element: <ProtectedRoutes />,
    children: [{ path: '/profile', element: <Profile /> }]
  },
  // Fallback Route
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;
