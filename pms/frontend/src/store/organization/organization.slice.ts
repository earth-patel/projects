import { createSlice } from '@reduxjs/toolkit';

import { createOrganization, listMyOrganizations, listOrgMembers } from './organization.thunk';
import {
  type OrganizationItem,
  type OrganizationState
} from './organization.types';
import { handleApiError } from '../../utils/common';
import { toast } from '../../utils/toast';

/* ---------- CONSTANTS ---------- */
const STORAGE_KEY = 'selectedOrganization';

/* ---------- HELPERS ---------- */
const handleOrganizationError = (payload: any) => {
  return handleApiError(payload, { general: 'Something went wrong' });
};

const loadSelectedOrg = (): OrganizationItem | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OrganizationItem) : null;
  } catch {
    return null;
  }
};

/* ---------- INITIAL STATE ---------- */
const initialState: OrganizationState = {
  organizations: [],
  selectedOrganization: loadSelectedOrg(),
  members: [],
  membersLoading: false,
  organizationLoading: false,
  createOrganizationLoading: false,
  organizationError: null
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setSelectedOrganization(state, action) {
      state.selectedOrganization = action.payload;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
    },
    clearOrganizations(state) {
      state.organizations = [];
    },
    clearMembers(state) {
      state.members = [];
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

        // If the cached selected org is stale (e.g. user was removed),
        // verify it still exists in the freshly loaded list. If not, clear it from state and sessionStorage.
        if (state.selectedOrganization) {
          const stillExists = action.payload.some(
            org => org.id === state.selectedOrganization?.id
          );
          if (!stillExists) {
            state.selectedOrganization = null;
            sessionStorage.removeItem(STORAGE_KEY);
          }
        }
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
      })

      // listOrgMembers
      .addCase(listOrgMembers.pending, (state) => {
        state.membersLoading = true;
      })
      .addCase(listOrgMembers.fulfilled, (state, action) => {
        state.membersLoading = false;
        state.members = action.payload;
      })
      .addCase(listOrgMembers.rejected, state => {
        state.membersLoading = false;
        toast.error('Failed to load members.');
      });
  }
});

export const {
  setSelectedOrganization,
  clearOrganizations,
  clearMembers,
  clearCreateOrganizationError,
  setCreateOrganizationError
} = organizationSlice.actions;

export default organizationSlice.reducer;
