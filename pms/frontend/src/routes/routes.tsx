import { createBrowserRouter, Navigate } from "react-router";

import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import ProtectedRoutes from "./protectedRoutes";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PublicRoutes from "./publicRoutes";
import { getToken } from "../utils/common";

const router = createBrowserRouter([
  // Default Route
  {
    path: '/',
    element: getToken() ? <Navigate to="/profile" /> : <Navigate to="/login" />
  },
  // Public Routes
  {
    element: <PublicRoutes />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      }
    ]
  },
  // Protected Routes
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: '/profile',
        element: <Profile />
      }
    ]
  },
  // Fallback Route
  {
    path: '*',
    element: getToken() ? <NotFound /> : <Navigate to="/login" />
  }
]);

export default router;
