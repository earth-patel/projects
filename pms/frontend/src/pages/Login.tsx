import React from 'react';
import { useNavigate } from 'react-router';

import FormError from '../components/FormError';
import Notify from '../components/Notify';
import { fetchMe, login } from '../store/auth/auth.thunk';
import { clearErrors, clearNotify, setErrors } from '../store/auth/auth.slice';
import { useAppDispatch, useAppSelector } from '../store/index';
import { validateLogin } from '../utils/common';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, loading, notify } = useAppSelector(state => state.auth);

  const resetUiState = () => {
    dispatch(clearErrors());
    dispatch(clearNotify());
  };

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetUiState();

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: String(formData.get('email')),
      password: String(formData.get('password'))
    };

    const errors = validateLogin(payload);
    if (Object.keys(errors).length) {
      dispatch(setErrors({ errors }));
      return;
    }

    dispatch(login(payload))
      .unwrap()
      .then(data => {
        if (data.token) dispatch(fetchMe(data.token as string));
      });
  };

  const resendVerificationEmail = () => {
    // todo: implement resend verification email functionality
  };

  return (
    <form onSubmit={onLogin}>
      <h2>Login</h2>

      <Notify notify={notify} />

      <input type="email" name="email" placeholder="Email" required />
      <FormError error={error?.errors?.email} />
      <br />

      <input type="password" name="password" placeholder="Password" required />
      <FormError error={error?.errors?.password} />
      <br />

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <FormError error={error?.errors?.form} />
      {error?.message &&
        error.message.toLowerCase().includes('email not verified') && (
          <button type="button" onClick={resendVerificationEmail}>
            Resend Verification Email
          </button>
        )}

      <p>
        Don't have an account?
        <button
          type="button"
          onClick={() => {
            resetUiState();
            navigate('/register');
          }}
        >
          Register
        </button>
      </p>
    </form>
  );
};

export default Login;
