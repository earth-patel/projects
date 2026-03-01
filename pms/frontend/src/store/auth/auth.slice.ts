import { createSlice } from '@reduxjs/toolkit';

import { api } from '../../api/axios';
import {
  fetchMe,
  forgotPassword,
  login,
  register,
  resendVerificationEmail,
  resetPassword,
  verifyEmail
} from './auth.thunk';
import { type AuthState } from './auth.types';
import { type AuthApiErrorResponse } from '../../types/api.types';
import { handleApiError } from '../../utils/common';
import { toast } from '../../utils/toast';

/* ---------- HELPERS ---------- */
const handleAuthError = (payload: any) => {
  return handleApiError(payload, { form: 'Something went wrong' });
};

/* ---------- INITIAL STATE ---------- */
const initialState: AuthState = {
  user: null,
  authLoading: false,
  loginError: null,
  registerError: null,
  forgotPasswordError: null,
  resetPasswordError: null,
  resendVerificationEmailLoading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout() {
      localStorage.removeItem('token');
      api.defaults.headers.common['Authorization'] = undefined;
      return initialState;
    },
    setLoginError(state, action: { payload: AuthApiErrorResponse }) {
      state.loginError = action.payload;
    },
    clearLoginError(state) {
      state.loginError = null;
    },
    setRegisterError(state, action: { payload: AuthApiErrorResponse }) {
      state.registerError = action.payload;
    },
    clearRegisterError(state) {
      state.registerError = null;
    },
    setForgotPasswordError(state, action: { payload: AuthApiErrorResponse }) {
      state.forgotPasswordError = action.payload;
    },
    clearForgotPasswordError(state) {
      state.forgotPasswordError = null;
    },
    setResetPasswordError(state, action: { payload: AuthApiErrorResponse }) {
      state.resetPasswordError = action.payload;
    },
    clearResetPasswordError(state) {
      state.resetPasswordError = null;
    }
  },
  extraReducers: builder => {
    builder
      // register
      .addCase(register.pending, state => {
        state.authLoading = true;
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.authLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(register.rejected, (state, action) => {
        state.authLoading = false;
        state.registerError = handleAuthError(action.payload);
      })

      // login
      .addCase(login.pending, state => {
        state.authLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authLoading = false;
        localStorage.setItem('token', action.payload.token);
        api.defaults.headers.common['Authorization'] =
          `Bearer ${action.payload.token}`;
      })
      .addCase(login.rejected, (state, action) => {
        state.authLoading = false;
        state.loginError = handleAuthError(action.payload);
      })

      // fetchMe
      .addCase(fetchMe.pending, state => {
        state.authLoading = true;
        state.loginError = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.authLoading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.authLoading = false;
        state.loginError = handleAuthError(action.payload);
        localStorage.removeItem('token');
        api.defaults.headers.common['Authorization'] = undefined;
      })

      // verifyEmail
      .addCase(verifyEmail.fulfilled, (_, action) => {
        toast.success(action.payload.message);
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loginError = handleAuthError(action.payload);
      })

      // resendVerificationEmail
      .addCase(resendVerificationEmail.pending, state => {
        state.resendVerificationEmailLoading = true;
      })
      .addCase(resendVerificationEmail.fulfilled, (state, action) => {
        state.resendVerificationEmailLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.resendVerificationEmailLoading = false;
        state.loginError = handleAuthError(action.payload);
      })

      // forgotPassword
      .addCase(forgotPassword.pending, state => {
        state.authLoading = true;
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.authLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.authLoading = false;
        state.forgotPasswordError = handleAuthError(action.payload);
      })

      // resetPassword
      .addCase(resetPassword.pending, state => {
        state.authLoading = true;
        state.resetPasswordError = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.authLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.authLoading = false;
        state.resetPasswordError = handleAuthError(action.payload);
      });
  }
});

export const {
  clearForgotPasswordError,
  clearLoginError,
  clearRegisterError,
  clearResetPasswordError,
  logout,
  setForgotPasswordError,
  setLoginError,
  setRegisterError,
  setResetPasswordError
} = authSlice.actions;

export default authSlice.reducer;
