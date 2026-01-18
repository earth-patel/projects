import React from 'react';
import { Link, useNavigate } from 'react-router';

import FormError from '../components/FormError';
import { clearSuccessMessage, login, setErrors } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/index';
import { validateLogin } from '../utils/validators';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useAppSelector(
    state => state.auth
  );

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearSuccessMessage());

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: String(formData.get('email')),
      password: String(formData.get('password'))
    };

    const errors = validateLogin(payload);
    if (Object.keys(errors).length) {
      dispatch(setErrors(errors));
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
      <FormError message={error?.email} />
      <br />

      <input type="password" name="password" placeholder="Password" required />
      <FormError message={error?.password} />
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
