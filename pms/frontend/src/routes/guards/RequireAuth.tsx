import { Navigate, Outlet } from 'react-router';

import { useAppSelector } from '../../store/index';

const RequireAuth = () => {
  const token = useAppSelector(state => state.auth.token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
