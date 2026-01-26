// FIELD-LEVEL AUTH VALIDATION ERRORS
type AuthErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;

  // Generic form-level error
  form?: string;
};

// NOTIFICATION TYPES
type NotifyType = 'success' | 'error' | 'warning' | 'info';

// API ERROR RESPONSE STRUCTURE
export type ApiErrorResponse = {
  message?: string;
  errors?: AuthErrors;
};

// USER TYPE (Returned from `/auth/me` endpoint)
export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

// PAYLOAD TYPES
export type NotifyPayload = {
  id: string;
  type: NotifyType;
  message: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

// AUTH STATE INTERFACE
export interface AuthState {
  // Logged-in user (null if unauthenticated)
  user: User | null;

  // Global loading state
  loading: boolean;

  // Errors specific to reset password flow
  resetPasswordError: ApiErrorResponse | null;

  // Errors specific to forgot password flow
  forgotPasswordError: ApiErrorResponse | null;

  // Errors from login attempts
  loginError: ApiErrorResponse | null;

  // Errors from registration attempts
  registerError: ApiErrorResponse | null;

  // Loading state for resend verification email action
  resendVerificationEmailLoading: boolean;

  // Global notification (toasts)
  notifyQueue: NotifyPayload[];
}
