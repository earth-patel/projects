import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../api/axios';
import { type OrganizationItem } from './organization.types';
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
