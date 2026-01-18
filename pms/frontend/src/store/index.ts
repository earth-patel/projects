import { configureStore } from '@reduxjs/toolkit';
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector
} from 'react-redux';

import authReducer from './authSlice';

/* ---------- STORE ---------- */
export const store = configureStore({
  reducer: {
    auth: authReducer
  }
});

/* ---------- TYPES ---------- */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/* ---------- TYPED HOOKS ---------- */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
