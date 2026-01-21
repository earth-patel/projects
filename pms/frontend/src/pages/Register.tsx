import React from 'react';
import { useNavigate } from 'react-router';

import FormError from '../components/FormError';
import { register } from '../store/auth/auth.thunk';
import { clearErrors, setErrors } from '../store/auth/auth.slice';
import { useAppDispatch, useAppSelector } from '../store/index';
import { validateRegister } from '../utils/common';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, loading } = useAppSelector(state => state.auth);

  const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearErrors());

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

    dispatch(register(payload))
      .unwrap()
      .then(() => {
        navigate('/login');
      });
  };

  return (
    <form onSubmit={onRegister}>
      <h2>Register</h2>

      <input type="text" name="firstName" placeholder="First Name" required />
      <FormError error={error?.firstName} />
      <br />

      <input type="text" name="lastName" placeholder="Last Name" required />
      <FormError error={error?.lastName} />
      <br />

      <input type="email" name="email" placeholder="Email" required />
      <FormError error={error?.email} />
      <br />

      <input type="password" name="password" placeholder="Password" required />
      <FormError error={error?.password} />
      <br />

      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      <FormError error={error?.form} />

      <p>
        Already have an account?
        <button
          type="button"
          onClick={() => {
            dispatch(clearErrors());
            navigate('/login');
          }}
        >
          Login
        </button>
      </p>
    </form>
  );
};

export default Register;
