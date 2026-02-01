import { createSlice } from '@reduxjs/toolkit';

import { type NotificationState, type NotificationType } from './notification.types';

/* ---------- INITIAL STATE ---------- */
const initialState: NotificationState = {
  notificationQueue: []
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    pushNotification(state, action: {
      payload: {
        type: NotificationType;
        message: string;
      }
    }) {
      state.notificationQueue.push({
        id: crypto.randomUUID(),
        type: action.payload.type,
        message: action.payload.message
      });
    },
    removeNotification(state, action: { payload: string }) {
      state.notificationQueue = state.notificationQueue.filter(
        notification => notification.id !== action.payload
      );
    }
  }
});

export const { pushNotification, removeNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
