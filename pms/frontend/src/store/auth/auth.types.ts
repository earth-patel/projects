import { type Organization } from '../organization/organization.types';
import { type ApiErrorResponse } from '../../types/api.types';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type MeResponse = {
  user: User;
  organizations: Organization[];
  activeOrganizationId: number | null;
};

export interface AuthState {
  user: User | null;
  loading: boolean;

  loginError: ApiErrorResponse | null;
  registerError: ApiErrorResponse | null;
  forgotPasswordError: ApiErrorResponse | null;
  resetPasswordError: ApiErrorResponse | null;

  resendVerificationEmailLoading: boolean;
}
