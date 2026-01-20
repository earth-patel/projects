import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api } from '../api/axios';

/* ---------- CONSTANTS ---------- */
const fallbackError = { form: 'Something went wrong' };

type NotifyType = 'success' | 'error' | 'warning' | 'info';

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

type Notify = {
  type: NotifyType,
  message: string,
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthErrors | null;
  notify: Notify | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  notify: null,
}

/* ---------- THUNKS ---------- */
export const fetchMe = createAsyncThunk<
  { user: User }, // returned on success
  string, // argument (token)
  {
    state: { auth: AuthState };
    rejectValue: { errors: AuthErrors };
  }
>('auth/fetchMe', (token, { rejectWithValue }) => {
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
      state.loading = false;
      state.notify = null;
      state.error = null;
    },
    setErrors(state, action: { payload: AuthErrors }) {
      state.error = action.payload;
    },
    clearErrors(state) {
      state.error = null;
    },
    setNotify(state, action: { payload: Notify  }) {
      state.notify = action.payload;
    },
    clearNotify(state) {
      state.notify = null;
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
        state.notify = {
          type: 'success',
          message: action.payload.message
        }
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
        state.error = handleError(action.payload?.errors);
      });
  }
});

export const { logout, setErrors, clearErrors, setNotify, clearNotify } =
  authSlice.actions;
export default authSlice.reducer;
