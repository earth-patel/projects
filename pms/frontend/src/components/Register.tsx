import React from 'react';
import { Link, useNavigate } from 'react-router';

import { register, setErrors } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/index';

type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type RegisterErrors = Partial<RegisterPayload> & { form?: string };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(state => state.auth);

  const validate = (data: RegisterPayload): RegisterErrors => {
    const error: RegisterErrors = {};

    if (!data.firstName) error.firstName = 'First name is required';
    if (!data.lastName) error.lastName = 'Last name is required';

    if (!data.email) error.email = 'Email is required';
    else if (!emailRegex.test(data.email)) error.email = 'Invalid email format';

    if (!data.password) error.password = 'Password is required';
    else if (data.password.length < 8)
      error.password = 'Password must be at least 8 characters long';

    return error;
  };

  const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const payload: RegisterPayload = {
      firstName: String(formData.get('firstName')),
      lastName: String(formData.get('lastName')),
      email: String(formData.get('email')),
      password: String(formData.get('password'))
    };

    const validationErrors = validate(payload);
    if (Object.keys(validationErrors).length) {
      dispatch(setErrors(validationErrors));
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
      {error?.firstName && <div className="error">{error.firstName}</div>}
      {!error?.firstName && <br />}
      <br />

      <input type="text" name="lastName" placeholder="Last Name" required />
      {error?.lastName && <div className="error">{error.lastName}</div>}
      {!error?.lastName && <br />}
      <br />

      <input type="email" name="email" placeholder="Email" required />
      {error?.email && <div className="error">{error.email}</div>}
      {!error?.email && <br />}
      <br />

      <input type="password" name="password" placeholder="Password" required />
      {error?.password && <div className="error">{error.password}</div>}
      {!error?.password && <br />}
      <br />

      <button type="submit" disabled={loading}>
        Register
      </button>
      {error?.form && <div className="error">{error.form}</div>}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
};

export default Register;
