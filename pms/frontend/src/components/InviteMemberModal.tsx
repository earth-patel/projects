import { useEffect, useState } from 'react';

import Error from './Error';
import FormInput from './FormInput';
import FormModal from './FormModal';
import { useAppDispatch, useAppSelector } from '../store/index';
import {
  clearInvitationError,
  setInvitationError
} from '../store/invitation/invitation.slice';
import { sendInvitation } from '../store/invitation/invitation.thunk';

interface InviteMemberModalProps {
  isOpen: boolean;
  organizationId: number;
  organizationName: string;
  userRole: string;
  onClose: () => void;
}

const InviteMemberModal = ({
  isOpen,
  organizationId,
  organizationName,
  userRole,
  onClose
}: InviteMemberModalProps) => {
  const dispatch = useAppDispatch();
  const { invitationError, invitationLoading } = useAppSelector(
    state => state.invitation
  );
  const [email, setEmail] = useState('');
  const [roleName, setRoleName] = useState('MEMBER');

  // OWNER can assign ADMIN or MEMBER; ADMIN can only assign MEMBER
  const assignableRoles =
    userRole === 'OWNER' ? ['ADMIN', 'MEMBER'] : ['MEMBER'];

  useEffect(() => {
    return () => {
      dispatch(clearInvitationError());
    };
  }, [dispatch]);

  const handleInviteMember = () => {
    dispatch(sendInvitation({ email, organizationId, roleName }))
      .unwrap()
      .then(() => {
        onClose();
      });
  };

  const validateInviteMember = () => {
    if (!email.trim()) {
      dispatch(
        setInvitationError({
          errors: { email: 'Email is required' }
        })
      );
      return false;
    }
    return true;
  };

  return (
    <FormModal
      isOpen={isOpen}
      title={`Invite to ${organizationName}`}
      onClose={onClose}
      onSubmit={handleInviteMember}
      submitText="Send Invite"
      validate={validateInviteMember}
      loading={invitationLoading}
      loadingText="Sending..."
    >
      <FormInput
        type="text"
        name="email"
        placeholder="Email address"
        error={invitationError?.errors?.email}
        onChange={e => setEmail(e.target.value)}
        required
      />

      {assignableRoles.length > 1 && (
        <select value={roleName} onChange={e => setRoleName(e.target.value)}>
          {assignableRoles.map(role => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      )}
      <Error error={invitationError?.errors?.general} />
    </FormModal>
  );
};

export default InviteMemberModal;
