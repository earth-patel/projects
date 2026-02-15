import Modal from './Modal';

interface FormModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
  submitText?: string;
  validate?: () => boolean;
  loading?: boolean;
  loadingText?: string;
}

const FormModal = ({
  isOpen,
  title,
  onClose,
  onSubmit,
  children,
  submitText = 'Submit',
  validate,
  loading = false,
  loadingText = 'Submitting...'
}: FormModalProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate) {
      const isValid = validate();
      if (!isValid) return;
    }

    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} title={title} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {children}

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? loadingText : submitText}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
