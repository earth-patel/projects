import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../api/axios';
import { type ApiErrorResponse } from './auth.types';
import {
  type LoginPayload,
  type RegisterPayload,
  type User
} from '../../types/auth.domain';

/* ---------- REGISTER ---------- */
export const register = createAsyncThunk<
  { message: string }, // returned on success
  RegisterPayload, // argument
  { rejectValue: ApiErrorResponse }
>('auth/register', (data, { rejectWithValue }) => {
  return api
    .post('auth/register', data)
    .then(res => res.data)
    .catch(err => rejectWithValue(err.response?.data));
});

/* ---------- LOGIN ---------- */
export const login = createAsyncThunk<
  { token: string }, // returned on success
  LoginPayload, // argument
  { rejectValue: ApiErrorResponse }
>('auth/login', (data, { rejectWithValue }) => {
  return api
    .post('auth/login', data)
    .then(res => res.data)
    .catch(err => {
      if (err.response?.status === 429) {
        return rejectWithValue({
          errors: {
            form: err.response.data?.message || 'Too many attempts. Try later.'
          }
        });
      }

      return rejectWithValue(err.response?.data);
    });
});

/* ---------- FETCH ME ---------- */
export const fetchMe = createAsyncThunk<
  { user: User }, // returned on success
  string, // argument (token)
  { rejectValue: ApiErrorResponse }
>('auth/fetchMe', (token, { rejectWithValue }) => {
  return api
    .get('auth/me', { headers: { Authorization: `Bearer ${token}` } })
    .then(res => res.data)
    .catch(err => rejectWithValue(err.response?.data));
});

/* ---------- VERIFY EMAIL ---------- */
export const verifyEmail = createAsyncThunk<
  { message: string }, // returned on success
  string, // argument (token)
  { rejectValue: ApiErrorResponse }
>('auth/verifyEmail', (token, { rejectWithValue }) => {
  return api
    .get(`auth/verify-email?token=${token}`)
    .then(res => res.data)
    .catch(err => rejectWithValue(err.response?.data));
});

/* ---------- RESEND VERIFICATION EMAIL ---------- */
export const resendVerificationEmail = createAsyncThunk<
  { message: string }, // returned on success
  string, // argument (email)
  { rejectValue: ApiErrorResponse }
>('auth/resendVerificationEmail', (email, { rejectWithValue }) => {
  return api
    .post('auth/resend-verification-email', { email })
    .then(res => res.data)
    .catch(err => rejectWithValue(err.response?.data));
});

/* ---------- FORGOT PASSWORD ---------- */
export const forgotPassword = createAsyncThunk<
  { message: string }, // returned on success
  string, // argument (email)
  { rejectValue: ApiErrorResponse }
>('auth/forgotPassword', (email, { rejectWithValue }) => {
  return api
    .post('auth/forgot-password', { email })
    .then(res => res.data)
    .catch(err => rejectWithValue(err.response?.data));
});

/* ---------- RESET PASSWORD ---------- */
export const resetPassword = createAsyncThunk<
  { message: string }, // returned on success
  { token: string; password: string }, // argument
  { rejectValue: ApiErrorResponse }
>('auth/resetPassword', (data, { rejectWithValue }) => {
  return api
    .post('auth/reset-password', data)
    .then(res => res.data)
    .catch(err => rejectWithValue(err.response?.data));
});
