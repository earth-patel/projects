import { Navigate, Outlet } from 'react-router';

import { useAppSelector } from '../store';

const PublicRoutes = () => {
  const { user } = useAppSelector(state => state.auth);

  if (user) return <Navigate to="/organization-selection" replace />;

  return <Outlet />;
};

export default PublicRoutes;
