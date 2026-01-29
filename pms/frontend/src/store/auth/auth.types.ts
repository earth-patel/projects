import { type User } from '../../types/auth.domain';

// FIELD-LEVEL AUTH VALIDATION ERRORS
type AuthErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  organizationName?: string;
  form?: string;
};

// API ERROR RESPONSE STRUCTURE
export type ApiErrorResponse = {
  message?: string;
  errors?: AuthErrors;
};

// PAYLOAD TYPES
export type NotifyPayload = {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
};

// AUTH STATE INTERFACE
export interface AuthState {
  user: User | null;
  loading: boolean;
  resetPasswordError: ApiErrorResponse | null;
  forgotPasswordError: ApiErrorResponse | null;
  loginError: ApiErrorResponse | null;
  registerError: ApiErrorResponse | null;
  resendVerificationEmailLoading: boolean;
  notifyQueue: NotifyPayload[];
}
