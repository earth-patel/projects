import { Navigate, Outlet } from 'react-router';

import { useAppSelector } from '../store';

const ProtectedRoutes = () => {
  const { user } = useAppSelector(state => state.auth);

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoutes;
