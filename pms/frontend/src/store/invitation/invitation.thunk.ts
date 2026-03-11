import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../api/axios';
import { type InvitationApiErrorResponse } from '../../types/api.types';

/* ---------- SEND INVITE ---------- */
export const sendInvite = createAsyncThunk<
  { message: string }, // returned on success
  { email: string; organizationId: number; roleName: string }, // argument
  { rejectValue: InvitationApiErrorResponse }
>('invitation/sendInvite', (data, { rejectWithValue }) => {
  return api
    .post('invitation/send-invite', data)
    .then(res => res.data)
    .catch(err => rejectWithValue(err.response?.data));
});
