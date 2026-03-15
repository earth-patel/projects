import { createSlice } from '@reduxjs/toolkit';

import { fetchInviteInfo, sendInvite } from './invitation.thunk';
import { type InvitationState } from './invitation.types';
import { handleApiError } from '../../utils/common';
import { toast } from '../../utils/toast';

/* ---------- HELPERS ---------- */
const handleInvitationError = (payload: any) => {
  return handleApiError(payload, { general: 'Something went wrong' });
};

/* ---------- INITIAL STATE ---------- */
const initialState: InvitationState = {
  invitationInfo: null,
  invitationLoading: false,
  invitationInfoError: null,
  sendInviteError: null,
  sendInviteLoading: false
};

const invitationSlice = createSlice({
  name: 'invitation',
  initialState,
  reducers: {
    setSendInviteError(state, action) {
      state.sendInviteError = action.payload;
    },
    clearSendInviteError(state) {
      state.sendInviteError = null;
    }
  },
  extraReducers: builder => {
    builder
      // sendInvite
      .addCase(sendInvite.pending, state => {
        state.sendInviteLoading = true;
      })
      .addCase(sendInvite.fulfilled, (state, action) => {
        state.sendInviteLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(sendInvite.rejected, (state, action) => {
        state.sendInviteLoading = false;
        state.sendInviteError = handleInvitationError(action.payload);
      })

      // fetchInviteInfo
      .addCase(fetchInviteInfo.pending, state => {
        state.invitationLoading = true;
        state.invitationInfoError = null;
        state.invitationInfo = null;
      })
      .addCase(fetchInviteInfo.fulfilled, (state, action) => {
        state.invitationLoading = false;
        state.invitationInfo = action.payload.invitation;
      })
      .addCase(fetchInviteInfo.rejected, (state, action) => {
        state.invitationLoading = false;
        state.invitationInfoError = handleInvitationError(action.payload);
      });

  }
});

export const { clearSendInviteError, setSendInviteError } =
  invitationSlice.actions;

export default invitationSlice.reducer;
