import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import Card from './Card';
import InviteMemberModal from './InviteMemberModal';
import { useAppDispatch, useAppSelector } from '../store/index';
import { clearOrganizations, setSelectedOrganization } from '../store/organization/organization.slice';
import { listMyOrganizations } from '../store/organization/organization.thunk';
import { type OrganizationItem } from '../store/organization/organization.types';

const CAN_INVITE_ROLES = ['OWNER', 'ADMIN'];

const OrganizationList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

  const handleSelectOrg = (org: OrganizationItem) => {
    dispatch(setSelectedOrganization(org));
    navigate('/dashboard');
  }

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
        {organizations.length === 0 ? (
          <div className="empty-state">No organizations yet</div>
        ) : (
          organizations.map(org => (
            <div key={org.id} className="org-card-wrapper">
              <Card title={org.name} subtitle={`Role: ${org.role}`} onClick={() => handleSelectOrg(org)} />
              {CAN_INVITE_ROLES.includes(org.role) && (
                <button
                  className="btn btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    setInviteTarget(org)
                  }}
                >
                  Invite
                </button>
              )}
            </div>
          ))
        )}
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
