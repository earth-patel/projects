import React from 'react';
import { useNavigate } from 'react-router';

import FormError from '../components/FormError';
import { clearErrors, clearNotify, fetchMe, login, setErrors } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/index';
import { validateLogin } from '../utils/common';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, notify } = useAppSelector(
    state => state.auth
  );

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearNotify());

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

    dispatch(login(payload))
      .unwrap()
      .then((data) => {
        if (data.token) dispatch(fetchMe(data.token));
      });
  };

  return (
    <form onSubmit={onLogin}>
      <h2>Login</h2>

      {notify && (<div className={notify.type}>
        {notify.message}
      </div>)}

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
        Don't have an account? <button type='button' onClick={() => { dispatch(clearErrors()); navigate('/register'); }}>Register</button>
      </p>
    </form>
  );
};

export default Login;
