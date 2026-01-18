import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

/* ---------- CONSTANTS ---------- */
const API_URL = 'http://localhost:3000/api/auth';

const fallbackError = { form: 'Something went wrong' };

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

  return axios
    .get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.data)
    .catch(error => {
      return rejectWithValue(error.response?.data);
    });
});

export const login = createAsyncThunk<
  { token: string }, // returned on success
  { email: string; password: string }, // argument
  { rejectValue: { errors: AuthErrors } }
>('auth/login', (data, { rejectWithValue }) => {
  return axios
    .post(`${API_URL}/login`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.data)
    .catch(error => {
      return rejectWithValue(error.response?.data);
    });
});

export const register = createAsyncThunk<
  { message: string }, // returned on success
  RegisterPayload, // argument
  { rejectValue: { errors: AuthErrors } }
>('auth/register', (data, { rejectWithValue }) => {
  return axios
    .post(`${API_URL}/register`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.data)
    .catch(error => {
      return rejectWithValue(error.response?.data);
    });
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
        const errors = action.payload?.errors;

        if (errors && Object.keys(errors).length > 0) {
          state.error = errors;
        } else {
          state.error = fallbackError;
        }
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
        const errors = action.payload?.errors;
        state.error =
          errors && Object.keys(errors).length > 0 ? errors : fallbackError;
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

        const errors = action.payload?.errors;
        state.error =
          errors && Object.keys(errors).length > 0 ? errors : fallbackError;
      });
  }
});

export const { logout, setErrors, setSuccessMessage, clearSuccessMessage } =
  authSlice.actions;
export default authSlice.reducer;
