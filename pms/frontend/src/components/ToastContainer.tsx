import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { toast, type ToastPayload } from '../utils/toast';

const toastRoot = document.getElementById('toast-root') as HTMLElement;
const TOAST_DURATION = 5000; // Duration in milliseconds

const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastPayload[]>([]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    const unsubscribe = toast.subscribe(newToast => {
      setToasts(prev => [...prev, newToast]);

      setTimeout(() => {
        removeToast(newToast.id);
      }, TOAST_DURATION);
    });

    return unsubscribe;
  }, []);

  if (!toastRoot || !toasts.length) return null;

  return createPortal(
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-message">{toast.message}</div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>,
    toastRoot
  );
};

export default ToastContainer;
