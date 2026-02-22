export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  firstName: string;
  lastName: string;
  organizationName: string;
};

type Errors<T> = Partial<Record<keyof T, string>>;

const validatePassword = (password: string) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
};

export const validateLogin = (data: LoginPayload) => {
  const error: Errors<LoginPayload> = {};

  if (!data.email) error.email = 'Email is required';
  if (!data.password) error.password = validatePassword(data.password);

  return error;
};

export const validateRegister = (data: RegisterPayload) => {
  const error: Errors<RegisterPayload> = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data.firstName) error.firstName = 'First name is required';
  if (!data.lastName) error.lastName = 'Last name is required';
  if (!data.organizationName)
    error.organizationName = 'Organization name is required';

  if (!data.email) error.email = 'Email is required';
  else if (!emailRegex.test(data.email)) error.email = 'Invalid email format';

  if (!data.password) error.password = validatePassword(data.password);

  return error;
};
