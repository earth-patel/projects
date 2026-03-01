import { createSlice } from '@reduxjs/toolkit';

import { createOrganization, listMyOrganizations } from './organization.thunk';
import { type OrganizationState } from './organization.types';
import { handleApiError } from '../../utils/common';
import { toast } from '../../utils/toast';

/* ---------- HELPERS ---------- */
const handleOrganizationError = (payload: any) => {
  return handleApiError(payload, { general: 'Something went wrong' });
};

/* ---------- INITIAL STATE ---------- */
const initialState: OrganizationState = {
  organizations: [],
  organizationLoading: false,
  createOrganizationLoading: false,
  organizationError: null
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    clearOrganizations(state) {
      state.organizations = [];
    },
    setCreateOrganizationError(state, action) {
      state.organizationError = action.payload;
    },
    clearCreateOrganizationError(state) {
      state.organizationError = null;
    }
  },
  extraReducers: builder => {
    builder
      // listMyOrganizations
      .addCase(listMyOrganizations.pending, state => {
        state.organizationLoading = true;
      })
      .addCase(listMyOrganizations.fulfilled, (state, action) => {
        state.organizationLoading = false;
        state.organizations = action.payload;
      })
      .addCase(listMyOrganizations.rejected, (state, action) => {
        state.organizationLoading = false;
        toast.error(
          action.payload?.message ||
            'Failed to fetch organizations. Please try again later.'
        );
      })

      // createOrganization
      .addCase(createOrganization.pending, state => {
        state.createOrganizationLoading = true;
      })
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.createOrganizationLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.createOrganizationLoading = false;
        state.organizationError = handleOrganizationError(action.payload);
      });
  }
});

export const {
  clearOrganizations,
  clearCreateOrganizationError,
  setCreateOrganizationError
} = organizationSlice.actions;

export default organizationSlice.reducer;
