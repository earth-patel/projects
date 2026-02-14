import { createSlice } from '@reduxjs/toolkit';

import { listMyOrganizations } from './organization.thunk';
import { type OrganizationState } from './organization.types';
import { toast } from '../../utils/toast';

/* ---------- INITIAL STATE ---------- */
const initialState: OrganizationState = {
  organizations: [],
  organizationLoading: false
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    clearOrganizations(state) {
      state.organizations = [];
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
        console.log('Fetched organizations:', action.payload);
      })
      .addCase(listMyOrganizations.rejected, (state, action) => {
        state.organizationLoading = false;
        toast.error(
          action.payload?.message ||
            'Failed to fetch organizations. Please try again later.'
        );
      });
  }
});

export const { clearOrganizations } = organizationSlice.actions;

export default organizationSlice.reducer;
