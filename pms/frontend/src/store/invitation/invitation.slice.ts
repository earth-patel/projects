import { createSlice } from '@reduxjs/toolkit';

import { sendInvitation } from './invitation.thunk';
import { type InvitationState } from './invitation.types';
import { type InvitationApiErrorResponse } from '../../types/api.types';
import { toast } from '../../utils/toast';

/* ---------- HELPERS ---------- */
const fallbackError: InvitationApiErrorResponse = {
  errors: { general: 'Something went wrong' }
};

const handleError = (payload?: InvitationApiErrorResponse) => {
  if (payload?.errors && Object.keys(payload.errors).length) {
    return payload;
  }
  return fallbackError;
};

/* ---------- INITIAL STATE ---------- */
const initialState: InvitationState = {
  invitationError: null,
  invitationLoading: false
};

const invitationSlice = createSlice({
  name: 'invitation',
  initialState,
  reducers: {
    setInvitationError(state, action) {
      state.invitationError = action.payload;
    },
    clearInvitationError(state) {
      state.invitationError = null;
    }
  },
  extraReducers: builder => {
    builder
      // send invite
      .addCase(sendInvitation.pending, state => {
        state.invitationLoading = true;
      })
      .addCase(sendInvitation.fulfilled, (state, action) => {
        state.invitationLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(sendInvitation.rejected, (state, action) => {
        state.invitationLoading = false;
        state.invitationError = handleError(action.payload);
      });
  }
});

export const { clearInvitationError, setInvitationError } =
  invitationSlice.actions;

export default invitationSlice.reducer;
