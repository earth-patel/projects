export type AuthErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  form?: string;
  message?: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export type NotifyType = 'success' | 'error' | 'warning' | 'info';

export type NotifyPayload = {
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

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthErrors | null;
  notify: NotifyPayload | null;
}
