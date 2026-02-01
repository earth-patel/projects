type Errors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  organizationName?: string;
  form?: string;
};

export type ApiErrorResponse = {
  message?: string;
  errors?: Errors;
};
