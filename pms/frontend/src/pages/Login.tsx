import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import Error from '../components/Error';
import FormInput from '../components/FormInput';
import {
  fetchMe,
  login,
  resendVerificationEmail
} from '../store/auth/auth.thunk';
import { setLoginError, clearLoginError } from '../store/auth/auth.slice';
import { useAppDispatch, useAppSelector } from '../store/index';
import { validateLogin } from '../utils/common';

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authLoading, loginError, resendVerificationEmailLoading } =
    useAppSelector(state => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearLoginError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!resendTimer) return;

    const interval = setInterval(() => {
      setResendTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };

    const errors = validateLogin(payload);
    if (Object.keys(errors).length) {
      dispatch(setLoginError({ errors }));
      return;
    }

    dispatch(login(payload))
      .unwrap()
      .then(data => {
        if (data.token) dispatch(fetchMe(data.token as string));
      });
  };

  const handleResendVerificationEmail = () => {
    const email = emailRef.current?.value;

    if (!email) {
      dispatch(setLoginError({ errors: { form: 'Email is required' } }));
      return;
    }
    dispatch(resendVerificationEmail(email));
    setResendTimer(60); // 60 seconds cooldown
  };

  const showResendButton = loginError?.message
    ?.toLowerCase()
    .includes('email not verified');

  return (
    <>
      <h2>Login</h2>

      <form onSubmit={onLogin}>
        <FormInput
          ref={emailRef}
          type="email"
          name="email"
          placeholder="Email"
          error={loginError?.errors?.email}
          required
        />

        <FormInput
          type="password"
          name="password"
          placeholder="Password"
          error={loginError?.errors?.password}
          required
        />

        <div className="form-actions">
          <button type="submit" disabled={authLoading}>
            {authLoading ? 'Logging in...' : 'Login'}
          </button>
          <button type="button" onClick={() => navigate('/forgot-password')}>
            Forgot Password
          </button>
        </div>

        <Error error={loginError?.errors?.form} />
        {showResendButton && (
          <button
            type="button"
            onClick={handleResendVerificationEmail}
            disabled={resendVerificationEmailLoading || resendTimer > 0}
          >
            {resendTimer > 0
              ? `Resend in ${resendTimer}s`
              : resendVerificationEmailLoading
                ? 'Sending...'
                : 'Resend Email'}
          </button>
        )}
      </form>

      <p className="form-footer">
        Don't have an account?
        <button type="button" onClick={() => navigate('/register')}>
          Register
        </button>
      </p>
    </>
  );
};

export default Login;
