import type { OrganizationApiErrorResponse } from '../../types/api.types';

export interface OrganizationItem {
  id: number;
  name: string;
  role: string;
}

export interface OrganizationState {
  organizations: OrganizationItem[];
  selectedOrganization: OrganizationItem | null;
  organizationError?: OrganizationApiErrorResponse | null;
  organizationLoading: boolean;
  createOrganizationLoading?: boolean;
}
