import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../api/axios';
import type {
  ApiErrorResponse,
  LoginPayload,
  RegisterPayload,
  User
} from './auth.types';

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
    .catch(err => rejectWithValue(err.response?.data));
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
