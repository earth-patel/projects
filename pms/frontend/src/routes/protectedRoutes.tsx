import { Navigate, Outlet } from 'react-router';

import Loading from '../components/Loading';
import { useAppSelector } from '../store';

const ProtectedRoutes = () => {
  const { authLoading, user } = useAppSelector(state => state.auth);

  if (authLoading) return <Loading />; // wait for fetchMe to finish
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoutes;
