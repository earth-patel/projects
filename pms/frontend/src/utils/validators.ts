type LoginPayload = {
  email: string;
  password: string;
};
type LoginErrors = Partial<LoginPayload> & { form?: string };

type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
type RegisterErrors = Partial<RegisterPayload> & { form?: string };

export const validateLogin = (data: LoginPayload) => {
  const error: LoginErrors = {};

  if (!data.email) error.email = 'Email is required';
  if (!data.password) error.password = 'Password is required';
  else if (data?.password.length < 8)
    error.password = 'Password must be at least 8 characters long';

  return error;
};

export const validateRegister = (data: RegisterPayload) => {
  const error: RegisterErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data.firstName) error.firstName = 'First name is required';
  if (!data.lastName) error.lastName = 'Last name is required';

  if (!data.email) error.email = 'Email is required';
  else if (!emailRegex.test(data.email)) error.email = 'Invalid email format';

  if (!data.password) error.password = 'Password is required';
  else if (data.password.length < 8)
    error.password = 'Password must be at least 8 characters long';

  return error;
};
