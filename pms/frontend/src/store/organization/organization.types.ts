export interface OrganizationItem {
  id: number;
  name: string;
  role: string;
}

export interface OrganizationState {
  organizations: OrganizationItem[];
  organizationLoading: boolean;
  createOrganizationLoading?: boolean;
}
