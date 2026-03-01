import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../api/axios';
import { type InvitationApiErrorResponse } from '../../types/api.types';

/* ---------- SEND INVITATION ---------- */
export const sendInvitation = createAsyncThunk<
  { message: string }, // returned on success
  { email: string; organizationId: number; roleName: string }, // argument
  { rejectValue: InvitationApiErrorResponse }
>('invitation/sendInvitation', (data, { rejectWithValue }) => {
  return api
    .post('invitation/send-invitation', data)
    .then(res => res.data)
    .catch(err => rejectWithValue(err.response?.data));
});
