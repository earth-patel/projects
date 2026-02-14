import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../api/axios';
import { type OrganizationItem } from './organization.types';
import { type ApiErrorResponse } from '../../types/api.types';

/* ---------- LIST MY ORGANIZATIONS ---------- */
export const listMyOrganizations = createAsyncThunk<
  OrganizationItem[], // returned on success
  void, // no argument
  { rejectValue: ApiErrorResponse }
>('organization/listMyOrganizations', (_, { rejectWithValue }) => {
  return api
    .get('organization/my-organizations')
    .then(res => res.data)
    .catch(err => rejectWithValue(err.response?.data));
});
