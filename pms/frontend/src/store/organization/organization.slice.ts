import { createSlice } from '@reduxjs/toolkit';

import { fetchMe } from '../auth/auth.thunk';
import { type OrganizationState } from './organization.types';

/* ---------- INITIAL STATE ---------- */
const initialState: OrganizationState = {
  organizations: [],
  activeOrganization: null
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    clearOrganizationState() {
      return initialState;
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchMe.fulfilled, (state, action) => {
      const { organizations, activeOrganizationId } = action.payload;
      state.organizations = organizations;
      state.activeOrganization =
        organizations.find(
          org => org.organizationId === activeOrganizationId
        ) ||
        organizations[0] ||
        null;
    });
  }
});

export const { clearOrganizationState } = organizationSlice.actions;

export default organizationSlice.reducer;
