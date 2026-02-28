import { useEffect, useState } from 'react';

import Card from './Card';
import InviteMemberModal from './InviteMemberModal';
import { useAppDispatch, useAppSelector } from '../store/index';
import { clearOrganizations } from '../store/organization/organization.slice';
import { listMyOrganizations } from '../store/organization/organization.thunk';
import { type OrganizationItem } from '../store/organization/organization.types';

const CAN_INVITE_ROLES = ['OWNER', 'ADMIN'];

const OrganizationList = () => {
  const dispatch = useAppDispatch();
  const { organizations, organizationLoading } = useAppSelector(
    state => state.organization
  );
  const [inviteTarget, setInviteTarget] = useState<OrganizationItem | null>(
    null
  );

  useEffect(() => {
    dispatch(listMyOrganizations());

    return () => {
      dispatch(clearOrganizations());
    };
  }, [dispatch]);

  if (organizationLoading) return <div>Loading organizations...</div>;

  return (
    <>
      <div className="organization-list-header">
        <div className="organization-list-title">My Organizations</div>
        <div className="organization-list-subtitle">
          Manage and access your organizations
        </div>
      </div>
      <div className="organization-list-grid">
        {organizations.map(org => (
          <div key={org.id} className="org-card-wrapper">
            <Card title={org.name} subtitle={`Role: ${org.role}`} />
            {CAN_INVITE_ROLES.includes(org.role) && (
              <button
                className="btn btn-secondary"
                onClick={() => setInviteTarget(org)}
              >
                Invite
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Invite Member Modal */}
      {inviteTarget && (
        <InviteMemberModal
          isOpen={!!inviteTarget}
          organizationId={inviteTarget.id}
          organizationName={inviteTarget.name}
          userRole={inviteTarget.role}
          onClose={() => setInviteTarget(null)}
        />
      )}
    </>
  );
};

export default OrganizationList;
