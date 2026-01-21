import type { NotifyPayload } from '../store/auth/auth.types';

interface NotifyProps {
  notify: NotifyPayload | null;
}

const Notify = ({ notify }: NotifyProps) => {
  if (!notify) return null;
  return <div className={notify.type}>{notify.message}</div>;
};

export default Notify;
