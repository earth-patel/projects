import { useEffect } from 'react';
import { Navigate } from 'react-router';

import Loading from '../components/Loading';
import Table from '../components/Table';
import { useAppDispatch, useAppSelector } from '../store/index';
import {
  listOrgMembers,
  removeMember
} from '../store/organization/organization.thunk';
import { type OrgMember } from '../store/organization/organization.types';

const ROLE_BADGE: Record<string, string> = {
  OWNER: 'badge-purple',
  ADMIN: 'badge-blue',
  MEMBER: 'badge-gray'
};

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { authLoading, user } = useAppSelector(state => state.auth);
  const { selectedOrganization, members, membersLoading, removeMemberLoading } =
    useAppSelector(state => state.organization);

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

  const hasAnyActions = members.some(m => canRemove(m));

  const memberColumns = [
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
              <div>
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
      {/* Header */}
      <div className="mb-3">
        <h2 className="heading">{selectedOrganization.name}</h2>
        <p className="subtitle mt-1">
          Your role: <strong>{selectedOrganization.role}</strong>
        </p>
      </div>

      {/* Members section */}
      <div>
        <div className="title mb-1">Members</div>

        {membersLoading ? (
          <Loading />
        ) : (
          <Table
            columns={memberColumns}
            data={members}
            keyExtractor={m => m.id}
            emptyMessage="No members found."
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
