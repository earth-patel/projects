import { Navigate, Route, Routes } from 'react-router';

import AuthFallback from './guards/authFallback';
import RequireAuth from './guards/requireAuth';
import RequireGuest from './guards/requireGuest';
import publicRoutes from './publicRoutes';
import privateRoutes from './privateRoutes';
import { useAppSelector } from '../store/index';

const AppRoutes = () => {
  const token = useAppSelector(state => state.auth.token);

  return (
    <Routes>
      {/* Default Route */}
      <Route
        path="/"
        element={<Navigate to={token ? '/profile' : '/login'} replace />}
      />

      {/* Public Routes */}
      <Route element={<RequireGuest />}>
        {publicRoutes.map(route => (
          <Route key={route.path} {...route} />
        ))}
      </Route>

      {/* Private Routes */}
      <Route element={<RequireAuth />}>
        {privateRoutes.map(route => (
          <Route key={route.path} {...route} />
        ))}
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<AuthFallback />} />
    </Routes>
  );
};

export default AppRoutes;
