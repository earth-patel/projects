export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  firstName: string;
  lastName: string;
  organizationName: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationName: string;
};
