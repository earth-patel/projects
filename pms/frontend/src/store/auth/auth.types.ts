import { type AuthApiErrorResponse } from '../../types/api.types';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type MeResponse = {
  user: User;
};

export interface AuthState {
  user: User | null;
  authLoading: boolean;

  loginError: AuthApiErrorResponse | null;
  registerError: AuthApiErrorResponse | null;
  forgotPasswordError: AuthApiErrorResponse | null;
  resetPasswordError: AuthApiErrorResponse | null;

  resendVerificationEmailLoading: boolean;
}
