import { useState } from 'react';

import FormModal from './FormModal';
import { toast } from '../utils/toast';

interface ChangeRoleModalProps {
  isOpen: boolean;
  memberName: string;
  currentRole: string;
  onClose: () => void;
  onSubmit: (roleName: string) => void;
  loading?: boolean;
}

const ASSIGNABLE_ROLES = ['Admin', 'Member'];

const ChangeRoleModal = ({
  isOpen,
  memberName,
  currentRole,
  onClose,
  onSubmit,
  loading = false
}: ChangeRoleModalProps) => {
  const [roleName, setRoleName] = useState('');

  const handleSubmit = () => {
    onSubmit(roleName);
  };

  return (
    <FormModal
      isOpen={isOpen}
      title={`Change Role — ${memberName}`}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText="Update Role"
      validate={() => {
        if (roleName === '') return false; // silent — no selection yet
        if (roleName.toLowerCase() === currentRole.toLowerCase()) {
          toast.error('Member already has this role');
          return false;
        }
        return true;
      }}
      loading={loading}
      loadingText="Updating..."
    >
      <select
        className="form-select w-100"
        value={roleName}
        onChange={e => setRoleName(e.target.value)}
      >
        <option value="" disabled>
          Select a role
        </option>
        {ASSIGNABLE_ROLES.map(role => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </FormModal>
  );
};

export default ChangeRoleModal;
