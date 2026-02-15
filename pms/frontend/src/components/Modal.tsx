interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-title">{title}</div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
