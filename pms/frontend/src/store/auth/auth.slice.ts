import { createSlice } from '@reduxjs/toolkit';

import {
  fetchMe,
  forgotPassword,
  login,
  register,
  resendVerificationEmail,
  resetPassword,
  verifyEmail
} from './auth.thunk';
import type { ApiErrorResponse, AuthState } from './auth.types';

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
  resetPasswordError: null,
  forgotPasswordError: null,
  loginError: null,
  registerError: null,
  resendVerificationEmailLoading: false,
  notifyQueue: []
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('token');
      state.user = null;
    },
    setLoginError(state, action: { payload: ApiErrorResponse }) {
      state.loginError = action.payload;
    },
    clearLoginError(state) {
      state.loginError = null;
    },
    setRegisterError(state, action: { payload: ApiErrorResponse }) {
      state.registerError = action.payload;
    },
    clearRegisterError(state) {
      state.registerError = null;
    },
    setForgotPasswordError(state, action: { payload: ApiErrorResponse }) {
      state.forgotPasswordError = action.payload;
    },
    clearForgotPasswordError(state) {
      state.forgotPasswordError = null;
    },
    setResetPasswordError(state, action: { payload: ApiErrorResponse }) {
      state.resetPasswordError = action.payload;
    },
    clearResetPasswordError(state) {
      state.resetPasswordError = null;
    },
    removeNotify(state, action: { payload: string }) {
      state.notifyQueue = state.notifyQueue.filter(
        notify => notify.id !== action.payload
      );
    }
  },
  extraReducers: builder => {
    builder
      // register
      .addCase(register.pending, state => {
        state.loading = true;
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.notifyQueue.push({
          id: crypto.randomUUID(),
          type: 'success',
          message: action.payload.message
        });
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.registerError = handleError(action.payload);
      })

      // login
      .addCase(login.pending, state => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.loginError = handleError(action.payload);
      })

      // fetchMe
      .addCase(fetchMe.pending, state => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.loginError = handleError(action.payload);
        localStorage.removeItem('token');
      })

      // verifyEmail
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.notifyQueue.push({
          id: crypto.randomUUID(),
          type: 'success',
          message: action.payload.message
        });
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loginError = handleError(action.payload);
      })

      // resendVerificationEmail
      .addCase(resendVerificationEmail.pending, state => {
        state.resendVerificationEmailLoading = true;
      })
      .addCase(resendVerificationEmail.fulfilled, (state, action) => {
        state.resendVerificationEmailLoading = false;
        state.notifyQueue.push({
          id: crypto.randomUUID(),
          type: 'success',
          message: action.payload.message
        });
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.resendVerificationEmailLoading = false;
        state.loginError = handleError(action.payload);
      })

      // forgotPassword
      .addCase(forgotPassword.pending, state => {
        state.loading = true;
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.notifyQueue.push({
          id: crypto.randomUUID(),
          type: 'success',
          message: action.payload.message
        });
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.forgotPasswordError = handleError(action.payload);
      })

      // resetPassword
      .addCase(resetPassword.pending, state => {
        state.loading = true;
        state.resetPasswordError = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.notifyQueue.push({
          id: crypto.randomUUID(),
          type: 'success',
          message: action.payload.message
        });
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.resetPasswordError = handleError(action.payload);
      });
  }
});

export const {
  clearForgotPasswordError,
  clearLoginError,
  clearRegisterError,
  clearResetPasswordError,
  logout,
  removeNotify,
  setForgotPasswordError,
  setLoginError,
  setRegisterError,
  setResetPasswordError
} = authSlice.actions;

export default authSlice.reducer;
