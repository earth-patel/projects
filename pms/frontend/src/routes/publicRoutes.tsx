import { Navigate, Outlet, useSearchParams } from 'react-router';

import { useAppSelector } from '../store';

const PublicRoutes = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAppSelector(state => state.auth);

  if (user) {
    const redirect = searchParams.get('redirect');
    return <Navigate to={redirect || '/organization-selection'} replace />;
  }

  return <Outlet />;
};

export default PublicRoutes;
