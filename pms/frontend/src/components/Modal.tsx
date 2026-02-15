interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ isOpen, title, children, onClose }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button type="button" className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">{title}</div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
