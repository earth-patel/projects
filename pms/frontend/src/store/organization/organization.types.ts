import type { OrganizationApiErrorResponse } from '../../types/api.types';

export interface OrganizationItem {
  id: number;
  name: string;
  role: string;
}

export interface OrgMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface OrganizationState {
  organizations: OrganizationItem[];
  selectedOrganization: OrganizationItem | null;
  members: OrgMember[];
  membersLoading: boolean;
  organizationError?: OrganizationApiErrorResponse | null;
  organizationLoading: boolean;
  createOrganizationLoading?: boolean;
  removeMemberLoading?: boolean;
}
