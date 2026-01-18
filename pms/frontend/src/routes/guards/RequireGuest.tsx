import { Navigate, Outlet } from 'react-router';

import { useAppSelector } from '../../store/index';

const RequireGuest = () => {
  const token = useAppSelector(state => state.auth.token);
  return token ? <Navigate to="/profile" replace /> : <Outlet />;
};

export default RequireGuest;
