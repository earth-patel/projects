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
import { type AuthState } from './auth.types';
import { type ApiErrorResponse } from '../../types/api.types';
import { toast } from '../../utils/toast';

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
      return initialState;
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
        state.registerError = handleError(action.payload);
      })

      // login
      .addCase(login.pending, state => {
        state.authLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authLoading = false;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.authLoading = false;
        state.loginError = handleError(action.payload);
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
        state.loginError = handleError(action.payload);
        localStorage.removeItem('token');
      })

      // verifyEmail
      .addCase(verifyEmail.fulfilled, (_, action) => {
        toast.success(action.payload.message);
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
        toast.success(action.payload.message);
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.resendVerificationEmailLoading = false;
        state.loginError = handleError(action.payload);
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
        state.forgotPasswordError = handleError(action.payload);
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
  setForgotPasswordError,
  setLoginError,
  setRegisterError,
  setResetPasswordError
} = authSlice.actions;

export default authSlice.reducer;
