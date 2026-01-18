import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api } from '../api/axios';

/* ---------- CONSTANTS ---------- */
const fallbackError = { form: 'Something went wrong' };

/* ---------- HELPERS ---------- */
const handleError = (errors?: AuthErrors) =>
  errors && Object.keys(errors).length ? errors : fallbackError;

/* ---------- TYPES ---------- */
type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type AuthErrors = {
  // field-specific errors
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;

  // general form error
  form?: string;
};

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: AuthErrors | null;
  successMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
  successMessage: null
};

/* ---------- THUNKS ---------- */
export const fetchMe = createAsyncThunk<
  { user: User }, // returned on success
  void, // no arguments needed
  {
    state: { auth: AuthState };
    rejectValue: { errors: AuthErrors };
  }
>('auth/fetchMe', (_, { getState, rejectWithValue }) => {
  const { token } = getState().auth;

  if (!token) {
    return rejectWithValue({
      errors: { form: 'Token not found. Please log in again.' }
    });
  }

  return api
    .get(`auth/me`, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => res.data)
    .catch(err => rejectWithValue(err.response?.data));
});

export const login = createAsyncThunk<
  { token: string }, // returned on success
  { email: string; password: string }, // argument
  { rejectValue: { errors: AuthErrors } }
>('auth/login', (data, { rejectWithValue }) => {
  return api
    .post(`auth/login`, data)
    .then(res => res.data)
    .catch(err => rejectWithValue(err.response?.data));
});

export const register = createAsyncThunk<
  { message: string }, // returned on success
  RegisterPayload, // argument
  { rejectValue: { errors: AuthErrors } }
>('auth/register', (data, { rejectWithValue }) => {
  return api
    .post(`auth/register`, data)
    .then(res => res.data)
    .catch(err => rejectWithValue(err.response?.data));
});

/* ---------- SLICE ---------- */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.loading = false;
      state.successMessage = null;
      state.error = null;
    },
    setErrors(state, action: { payload: AuthErrors }) {
      state.error = action.payload;
    },
    setSuccessMessage(state, action: { payload: string }) {
      state.successMessage = action.payload;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    }
  },
  extraReducers: builder => {
    builder
      // login
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = handleError(action.payload?.errors);
      })

      // register
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.successMessage = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = handleError(action.payload?.errors);
      })

      // fetchMe
      .addCase(fetchMe.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        state.error = handleError(action.payload?.errors);
      });
  }
});

export const { logout, setErrors, setSuccessMessage, clearSuccessMessage } =
  authSlice.actions;
export default authSlice.reducer;
