import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../api/axios';
import { type OrganizationItem, type OrgMember } from './organization.types';
import { type OrganizationApiErrorResponse } from '../../types/api.types';

/* ---------- LIST MY ORGANIZATIONS ---------- */
export const listMyOrganizations = createAsyncThunk<
  OrganizationItem[], // returned on success
  void, // no argument
  { rejectValue: OrganizationApiErrorResponse }
>('organization/listMyOrganizations', (_, { rejectWithValue }) => {
  return api
    .get('organization/my-organizations')
    .then(res => res.data)
    .catch(err => rejectWithValue(err.response?.data));
});

/* ---------- CREATE ORGANIZATION ---------- */
export const createOrganization = createAsyncThunk<
  { message: string }, // returned on success
  string, // argument (organization name)
  { rejectValue: OrganizationApiErrorResponse }
>(
  'organization/createOrganization',
  (organizationName, { rejectWithValue }) => {
    return api
      .post('organization/create-organization', { organizationName })
      .then(res => res.data)
      .catch(err => rejectWithValue(err.response?.data));
  }
);

/* ---------- LIST ORG MEMBERS ---------- */
export const listOrgMembers = createAsyncThunk<
  OrgMember[], // returned on success
  number, // argument (organization ID)
  { rejectValue: OrganizationApiErrorResponse }
>('organization/listOrgMembers', (orgId, { rejectWithValue }) => {
  return api
    .get(`organization/${orgId}/members`)
    .then(res => res.data)
    .catch(err => rejectWithValue(err.response?.data));
});

/* ---------- REMOVE MEMBER ---------- */
export const removeMember = createAsyncThunk<
  { message: string }, // returned on success
  { orgId: number; userId: number }, // argument
  { rejectValue: OrganizationApiErrorResponse }
>('organization/removeMember', ({ orgId, userId }, { rejectWithValue }) => {
  return api
    .delete(`organization/${orgId}/members/${userId}`)
    .then(res => res.data)
    .catch(err => rejectWithValue(err.response?.data));
});
