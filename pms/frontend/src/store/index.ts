import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector
} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/auth.slice';
import organizationReducer from './organization/organization.slice';

/* ---------- STORE ---------- */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    organization: organizationReducer
  }
});

/* ---------- TYPES ---------- */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/* ---------- TYPED HOOKS ---------- */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
