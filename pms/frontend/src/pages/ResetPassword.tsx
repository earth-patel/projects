import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import Error from '../components/Error';
import {
  clearResetPasswordError,
  setResetPasswordError
} from '../store/auth/auth.slice';
import { resetPassword } from '../store/auth/auth.thunk';
import { useAppDispatch, useAppSelector } from '../store/index';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { resetPasswordError, loading } = useAppSelector(state => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearResetPasswordError());
    };
  }, [dispatch]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = params.get('token');

    const password = new FormData(e.currentTarget).get('password') as string;
    if (!password || !token) {
      dispatch(
        setResetPasswordError({
          errors: { form: 'Token and password are required' }
        })
      );
      return;
    }

    dispatch(resetPassword({ token, password }))
      .unwrap()
      .then(() => {
        navigate('/login');
      });
  };

  return (
    <>
      <h2>Reset Password</h2>

      <form onSubmit={onSubmit}>
        <input
          type="password"
          name="password"
          placeholder="New Password"
          required
        />
        <button type="submit" disabled={loading}>
          Reset
        </button>

        <Error error={resetPasswordError?.errors?.form} />
      </form>
    </>
  );
};

export default ResetPassword;
