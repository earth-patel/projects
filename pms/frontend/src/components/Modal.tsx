interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
}

const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm'
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-title">{title}</div>

        <div className="modal-body">{children}</div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          {onConfirm && <button onClick={onConfirm}>{confirmText}</button>}
        </div>
      </div>
    </div>
  );
};

export default Modal;
