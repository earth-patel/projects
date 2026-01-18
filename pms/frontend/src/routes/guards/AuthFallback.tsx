import { Navigate } from 'react-router';

import NotFound from '../../pages/NotFound';
import { useAppSelector } from '../../store/index';

const AuthFallback = () => {
  const token = useAppSelector(state => state.auth.token);
  return token ? <NotFound /> : <Navigate to="/login" replace />;
};

export default AuthFallback;
