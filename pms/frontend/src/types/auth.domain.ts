export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  firstName: string;
  lastName: string;
  organizationName: string;
};

export type OrganizationRole = {
  organizationId: number;
  organizationName: string;
  role: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type MeResponse = {
  user: User;
  organizations: OrganizationRole[];
  activeOrganizationId: number | null;
};
