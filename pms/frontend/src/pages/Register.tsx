import React from 'react';
import { useNavigate } from 'react-router';

import FormError from '../components/FormError';
import { clearErrors, register, setErrors } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/index';
import { validateRegister } from '../utils/common';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(state => state.auth);

  const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const payload = {
      firstName: String(formData.get('firstName')),
      lastName: String(formData.get('lastName')),
      email: String(formData.get('email')),
      password: String(formData.get('password'))
    };

    const errors = validateRegister(payload);
    if (Object.keys(errors).length) {
      dispatch(setErrors(errors));
      return;
    }

    const resultAction = await dispatch(register(payload));
    if (register.fulfilled.match(resultAction)) {
      navigate('/login', { replace: true });
    }
  };

  return (
    <form onSubmit={onRegister}>
      <h2>Register</h2>

      <input type="text" name="firstName" placeholder="First Name" required />
      <FormError message={error?.firstName} />
      <br />

      <input type="text" name="lastName" placeholder="Last Name" required />
      <FormError message={error?.lastName} />
      <br />

      <input type="email" name="email" placeholder="Email" required />
      <FormError message={error?.email} />
      <br />

      <input type="password" name="password" placeholder="Password" required />
      <FormError message={error?.password} />
      <br />

      <button type="submit" disabled={loading}>
        Register
      </button>
      {error?.form && <div className="error">{error.form}</div>}

      <p>
        Already have an account? <button type='button' onClick={() => { dispatch(clearErrors()); navigate('/login'); }}>Login</button>
      </p>
    </form>
  );
};

export default Register;
