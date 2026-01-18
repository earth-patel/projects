import React from 'react';
import { Link, useNavigate } from 'react-router';

import { clearSuccessMessage, login, setErrors } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/index';

type LoginPayload = {
  email: string;
  password: string;
};

type LoginErrors = Partial<LoginPayload> & { form?: string };

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useAppSelector(
    state => state.auth
  );

  const validate = (data: LoginPayload): LoginErrors => {
    const error: LoginErrors = {};

    if (!data.email) error.email = 'Email is required';
    if (!data.password) error.password = 'Password is required';
    else if (data?.password.length < 8)
      error.password = 'Password must be at least 8 characters long';

    return error;
  };

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearSuccessMessage());

    const formData = new FormData(e.currentTarget);
    const payload: LoginPayload = {
      email: String(formData.get('email')),
      password: String(formData.get('password'))
    };

    const validationErrors = validate(payload);
    if (Object.keys(validationErrors).length) {
      dispatch(setErrors(validationErrors));
      return;
    }

    const resultAction = await dispatch(login(payload));
    if (login.fulfilled.match(resultAction)) {
      navigate('/profile', { replace: true });
    }
  };

  return (
    <form onSubmit={onLogin}>
      <h2>Login</h2>

      {successMessage && <div className="success">{successMessage}</div>}

      <input type="email" name="email" placeholder="Email" required />
      {error?.email && <div className="error">{error.email}</div>}
      {!error?.email && <br />}
      <br />

      <input type="password" name="password" placeholder="Password" required />
      {error?.password && <div className="error">{error.password}</div>}
      {!error?.password && <br />}
      <br />

      <button type="submit" disabled={loading}>
        Login
      </button>
      {error?.form && <div className="error">{error.form}</div>}

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </form>
  );
};

export default Login;
