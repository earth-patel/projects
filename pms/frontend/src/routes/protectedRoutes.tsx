import { Navigate, Outlet } from 'react-router';

import { useAppSelector } from '../store';

const ProtectedRoutes = () => {
  const { user } = useAppSelector(state => state.auth);

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
