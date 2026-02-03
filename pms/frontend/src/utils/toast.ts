type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastPayload = {
  id: string;
  type: ToastType;
  message: string;
};

type ToastListener = (toast: ToastPayload) => void;

const listeners = new Set<ToastListener>();

const emitToast = (type: ToastType, message: string) => {
  const toast: ToastPayload = {
    id: crypto.randomUUID(),
    type,
    message
  };

  listeners.forEach(listener => listener(toast));
};

export const toast = {
  subscribe(listener: ToastListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  success(message: string) {
    emitToast('success', message);
  },
  error(message: string) {
    emitToast('error', message);
  },
  warning(message: string) {
    emitToast('warning', message);
  },
  info(message: string) {
    emitToast('info', message);
  }
};
