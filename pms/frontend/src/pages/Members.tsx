import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';

import ChangeRoleModal from '../components/ChangeRoleModal';
import Loading from '../components/Loading';
import Table from '../components/Table';
import { useAppDispatch, useAppSelector } from '../store/index';
import {
  changeMemberRole,
  listOrgMembers,
  removeMember
} from '../store/organization/organization.thunk';
import { type OrgMember } from '../store/organization/organization.types';

const ROLE_BADGE: Record<string, string> = {
  OWNER: 'badge-purple',
  ADMIN: 'badge-blue',
  MEMBER: 'badge-gray'
};

const Members = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authLoading, user } = useAppSelector(state => state.auth);
  const {
    selectedOrganization,
    members,
    membersLoading,
    removeMemberLoading,
    changeRoleLoading
  } = useAppSelector(state => state.organization);

  // State for which member's role we're changing, if any. When null, the modal is closed.
  const [changeRoleTarget, setChangeRoleTarget] = useState<OrgMember | null>(
    null
  );

  useEffect(() => {
    if (!selectedOrganization) return;
    dispatch(listOrgMembers(selectedOrganization.id));
  }, [dispatch, selectedOrganization]);

  if (authLoading || !user) return <Loading />;

  // Shouldn't normally happen, but guard against direct URL access
  if (!selectedOrganization) {
    return <Navigate to="/organization-selection" replace />;
  }

  const currentUserRole = selectedOrganization.role;

  // A row can be acted upon if:
  //  - it's not the current user
  //  - it's not an OWNER (protected)
  const canActOn = (member: OrgMember) =>
    member.id !== user.id && member.role !== 'OWNER';

  // Only OWNER can remove ADMIN; both OWNER and ADMIN can remove MEMBER
  const canRemove = (member: OrgMember) => {
    if (!canActOn(member)) return false;
    if (currentUserRole === 'OWNER') return true;
    if (currentUserRole === 'ADMIN') return member.role === 'MEMBER';
    return false;
  };

  // Only OWNER can change roles
  const canChangeRole = (member: OrgMember) =>
    currentUserRole === 'OWNER' && canActOn(member);

  const handleRemove = (member: OrgMember) => {
    dispatch(
      removeMember({
        orgId: selectedOrganization.id,
        userId: member.id
      })
    )
      .unwrap()
      .then(() => {
        dispatch(listOrgMembers(selectedOrganization.id));
      });
  };

  const handleChangeRole = (roleName: string) => {
    if (!changeRoleTarget) return;

    dispatch(
      changeMemberRole({
        orgId: selectedOrganization.id,
        userId: changeRoleTarget.id,
        roleName
      })
    )
      .unwrap()
      .then(() => {
        setChangeRoleTarget(null);
        dispatch(listOrgMembers(selectedOrganization.id));
      });
  };

  const hasAnyActions = members.some(m => canRemove(m) || canChangeRole(m));

  const columns = [
    {
      header: 'Name',
      render: (m: OrgMember) => `${m.firstName} ${m.lastName}`
    },
    {
      header: 'Email',
      render: (m: OrgMember) => m.email
    },
    {
      header: 'Role',
      render: (m: OrgMember) => (
        <span className={`badge ${ROLE_BADGE[m.role] ?? 'badge-gray'}`}>
          {m.role}
        </span>
      )
    },
    // Only render the Actions column when the current user has at least one
    // action available — avoids an empty column for plain MEMBERs.
    ...(hasAnyActions
      ? [
          {
            header: 'Actions',
            render: (m: OrgMember) => (
              <div className="d-flex g-1">
                {canChangeRole(m) && (
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={changeRoleLoading}
                    onClick={() => setChangeRoleTarget(m)}
                  >
                    Change Role
                  </button>
                )}
                {canRemove(m) && (
                  <button
                    className="btn btn-danger btn-sm"
                    disabled={removeMemberLoading}
                    onClick={() => handleRemove(m)}
                  >
                    Remove
                  </button>
                )}
              </div>
            )
          }
        ]
      : [])
  ];

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <div className="title">Members</div>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/dashboard')}
        >
          Back to Projects
        </button>
      </div>

      {membersLoading ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          data={members}
          keyExtractor={m => m.id}
          emptyMessage="No members found."
        />
      )}

      {changeRoleTarget && (
        <ChangeRoleModal
          key={changeRoleTarget.id}
          isOpen={true}
          memberName={`${changeRoleTarget.firstName} ${changeRoleTarget.lastName}`}
          currentRole={changeRoleTarget.role}
          onClose={() => setChangeRoleTarget(null)}
          onSubmit={handleChangeRole}
          loading={changeRoleLoading}
        />
      )}
    </div>
  );
};

export default Members;
