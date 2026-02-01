import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { useAppDispatch, useAppSelector } from '../store/index';
import { removeNotification } from '../store/notification/notification.slice';

const toastRoot = document.getElementById('toast-root') as HTMLElement;
const TOAST_DURATION = 5000; // Duration in milliseconds

const ToastContainer = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(state => state.notification.notificationQueue);

  useEffect(() => {
    if (!toasts.length) return;

    const timers = toasts.map(toast =>
      setTimeout(() => {
        dispatch(removeNotification(toast.id));
      }, TOAST_DURATION)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, dispatch]);

  if (!toastRoot || !toasts.length) return null;

  return createPortal(
    <>
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </>,
    toastRoot
  );
};

export default ToastContainer;
