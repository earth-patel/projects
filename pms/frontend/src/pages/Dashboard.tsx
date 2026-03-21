import { useEffect } from 'react';
import { Navigate } from 'react-router';

import Loading from '../components/Loading';
import Table from '../components/Table';
import { useAppDispatch, useAppSelector } from '../store/index';
import { listOrgMembers } from '../store/organization/organization.thunk';
import { type OrgMember } from '../store/organization/organization.types';

const ROLE_BADGE: Record<string, string> = {
  OWNER: 'badge-purple',
  ADMIN: 'badge-blue',
  MEMBER: 'badge-gray'
};

const MEMBER_COLUMNS = [
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
  }
];

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { authLoading, user } = useAppSelector(state => state.auth);
  const { selectedOrganization, members, membersLoading } = useAppSelector(
    state => state.organization
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
            columns={MEMBER_COLUMNS}
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
