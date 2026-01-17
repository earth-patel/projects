import { Navigate, Route, Routes } from 'react-router';

import NotFound from '../components/NotFound';
import publicRoutes from './publicRoutes';
import privateRoutes from './privateRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Private Routes */}
      {privateRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
