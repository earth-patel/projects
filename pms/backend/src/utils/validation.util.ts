import { REQUIRED_ENV_VARS } from '../config/env.config';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';

/* ---------- CONSTANTS ---------- */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

/* ---------- HELPERS ---------- */
const isValidEmail = (email: string) => EMAIL_REGEX.test(email);
const isValidPasswordLength = (password: string) =>
  password.length >= PASSWORD_MIN_LENGTH;

const validateEmail = (email: string) => {
  if (!email) return 'Email is required';
  if (!isValidEmail(email)) return 'Invalid email format';
};

const validatePassword = (password: string) => {
  if (!password) return 'Password is required';
  if (!isValidPasswordLength(password))
    return `Password must be at least 8 characters long`;
};

/* ---------- TYPES ---------- */
type ValidationErrors<T> = Partial<Record<keyof T, string>>;

/* ---------- VALIDATORS ---------- */
export const validateRegisterDto = (data: RegisterDto) => {
  const errors: ValidationErrors<RegisterDto> = {};

  if (!data.firstName) errors.firstName = 'First name is required';
  if (!data.lastName) errors.lastName = 'Last name is required';
  if (!data.organizationName)
    errors.organizationName = 'Organization name is required';

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};

export const validateLoginDto = (data: LoginDto) => {
  const errors: ValidationErrors<LoginDto> = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};

export const validateEnvVar = () => {
  const missingVars = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

  if (missingVars.length) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};
