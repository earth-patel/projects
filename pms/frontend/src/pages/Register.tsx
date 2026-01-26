import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import Error from '../components/Error';
import FormInput from '../components/FormInput';
import { register } from '../store/auth/auth.thunk';
import { clearRegisterError, setRegisterError } from '../store/auth/auth.slice';
import { useAppDispatch, useAppSelector } from '../store/index';
import { validateRegister } from '../utils/common';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { registerError, loading } = useAppSelector(state => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearRegisterError());
    };
  }, [dispatch]);

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
      dispatch(setRegisterError({ errors }));
      return;
    }

    dispatch(register(payload))
      .unwrap()
      .then(() => {
        navigate('/login');
      });
  };

  return (
    <>
      <h2>Register</h2>

      <form onSubmit={onRegister}>
        <FormInput
          type="text"
          name="firstName"
          placeholder="First Name"
          error={registerError?.errors?.firstName}
          required
        />
        <br />

        <FormInput
          type="text"
          name="lastName"
          placeholder="Last Name"
          error={registerError?.errors?.lastName}
          required
        />
        <br />

        <FormInput
          type="email"
          name="email"
          placeholder="Email"
          error={registerError?.errors?.email}
          required
        />
        <br />

        <FormInput
          type="password"
          name="password"
          placeholder="Password"
          error={registerError?.errors?.password}
          required
        />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <Error error={registerError?.errors?.form} />
      </form>

      <p>
        Already have an account?
        <button
          type="button"
          onClick={() => {
            navigate('/login');
          }}
        >
          Login
        </button>
      </p>
    </>
  );
};

export default Register;
