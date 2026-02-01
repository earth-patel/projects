export type Organization = {
  organizationId: number;
  organizationName: string;
  role: string;
};

export type OrganizationState = {
  organizations: Organization[];
  activeOrganization: Organization | null;
};
