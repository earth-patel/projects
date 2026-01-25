import { createSlice } from '@reduxjs/toolkit';

import { fetchMe, login, register, verifyEmail } from './auth.thunk';
import type { ApiErrorResponse, AuthState, NotifyPayload } from './auth.types';

/* ---------- HELPERS ---------- */
const fallbackError: ApiErrorResponse = {
  errors: { form: 'Something went wrong' }
};

const handleError = (payload?: ApiErrorResponse) => {
  if (payload?.errors && Object.keys(payload.errors).length) {
    return payload;
  }
  return fallbackError;
};

/* ---------- INITIAL STATE ---------- */
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  notify: null
};

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
    setErrors(state, action: { payload: ApiErrorResponse }) {
      state.error = action.payload;
    },
    clearErrors(state) {
      state.error = null;
    },
    setNotify(state, action: { payload: NotifyPayload }) {
      state.notify = action.payload;
    },
    clearNotify(state) {
      state.notify = null;
    }
  },
  extraReducers: builder => {
    builder
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
        };
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = handleError(action.payload);
      })

      // login
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem('token', action.payload.token);
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = handleError(action.payload);
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
        state.error = handleError(action.payload);
        localStorage.removeItem('token');
      })

      // verifyEmail
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.notify = {
          type: 'success',
          message: action.payload.message
        };
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.notify = {
          type: 'error',
          message: action.payload?.message || 'Email verification failed'
        };
      });
  }
});

export const { clearErrors, clearNotify, logout, setErrors, setNotify } =
  authSlice.actions;

export default authSlice.reducer;
