type AuthErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  organizationName?: string;
  form?: string;
};

type OrganizationErrors = {
  name?: string;
  general?: string;
};

type InvitationErrors = {
  email?: string;
  role?: string;
  general?: string;
};

export type AuthApiErrorResponse = {
  message?: string;
  errors?: AuthErrors;
};

export type OrganizationApiErrorResponse = {
  message?: string;
  errors?: OrganizationErrors;
};

export type InvitationApiErrorResponse = {
  message?: string;
  errors?: InvitationErrors;
};
