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
  const { registerError, authLoading } = useAppSelector(state => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearRegisterError());
    };
  }, [dispatch]);

  const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const payload = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      organizationName: formData.get('organizationName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string
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

        <FormInput
          type="text"
          name="lastName"
          placeholder="Last Name"
          error={registerError?.errors?.lastName}
          required
        />

        <FormInput
          type="text"
          name="organizationName"
          placeholder="Organization Name"
          error={registerError?.errors?.organizationName}
          required
        />

        <FormInput
          type="email"
          name="email"
          placeholder="Email"
          error={registerError?.errors?.email}
          required
        />

        <FormInput
          type="password"
          name="password"
          placeholder="Password"
          error={registerError?.errors?.password}
          required
        />

        <button type="submit" disabled={authLoading}>
          {authLoading ? 'Registering...' : 'Register'}
        </button>
        <Error error={registerError?.errors?.form} />
      </form>

      <p className="form-footer">
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
