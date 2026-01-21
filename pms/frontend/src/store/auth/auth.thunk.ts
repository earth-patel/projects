import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../api/axios';
import type {
  AuthErrors,
  LoginPayload,
  RegisterPayload,
  User
} from './auth.types';

/* ---------- REGISTER ---------- */
export const register = createAsyncThunk<
  { message: string }, // returned on success
  RegisterPayload, // argument
  { rejectValue: { errors: AuthErrors } }
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
  { rejectValue: { errors: AuthErrors } }
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
  { rejectValue: { errors: AuthErrors } }
>('auth/fetchMe', (token, { rejectWithValue }) => {
  return api
    .get('auth/me', { headers: { Authorization: `Bearer ${token}` } })
    .then(res => res.data)
    .catch(err => rejectWithValue(err.response?.data));
});
