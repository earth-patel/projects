import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import Error from '../components/Error';
import {
  clearForgotPasswordError,
  setForgotPasswordError
} from '../store/auth/auth.slice';
import { forgotPassword } from '../store/auth/auth.thunk';
import { useAppDispatch, useAppSelector } from '../store/index';

const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { forgotPasswordError, loading } = useAppSelector(state => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearForgotPasswordError());
    };
  }, [dispatch]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = new FormData(e.currentTarget).get('email') as string;
    if (!email) {
      dispatch(
        setForgotPasswordError({ errors: { form: 'Email is required' } })
      );
      return;
    }

    dispatch(forgotPassword(email))
      .unwrap()
      .then(() => {
        navigate('/login');
      });
  };

  return (
    <>
      <h2>Forgot Password</h2>

      <form onSubmit={onSubmit}>
        <input type="email" name="email" placeholder="Email" required />
        <Error error={forgotPasswordError?.errors?.email} />
        <button type="submit" disabled={loading}>
          Send Reset Link
        </button>
      </form>
    </>
  );
};

export default ForgotPassword;
