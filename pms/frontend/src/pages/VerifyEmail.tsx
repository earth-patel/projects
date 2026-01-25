import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';

import { verifyEmail } from '../store/auth/auth.thunk';
import { useAppDispatch } from '../store/index';

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = params.get('token');
    if (!token) return;

    dispatch(verifyEmail(token));
    navigate('/login', { replace: true });
  }, [dispatch, navigate, params]);

  return <p>Verifying email...</p>;
};

export default VerifyEmail;
