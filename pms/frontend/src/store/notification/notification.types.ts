export type NotificationType = 'success' | 'error' | 'warning' | 'info';

type NotificationPayload = {
  id: string;
  type: NotificationType;
  message: string;
};

export interface NotificationState {
  notificationQueue: NotificationPayload[];
}
