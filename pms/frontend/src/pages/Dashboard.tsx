import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import Loading from '../components/Loading';
import { useAppDispatch, useAppSelector } from '../store/index';
import { clearMembers } from '../store/organization/organization.slice';
import { listOrgMembers } from '../store/organization/organization.thunk';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { authLoading, user } = useAppSelector(state => state.auth);
  const { selectedOrganization, members, membersLoading } = useAppSelector(state => state.organization);

  useEffect(() => {
    if (!selectedOrganization) return;
    dispatch(listOrgMembers(selectedOrganization.id));

    return () => {
      dispatch(clearMembers());
    };
  }, [dispatch, selectedOrganization]);

  if (authLoading || !user) return <Loading />;

  // Shouldn't normally happen, but guard against direct URL access
  if (!selectedOrganization) {
    return (
      <div className="container">
        <h2 className="heading">No organization selected</h2>
        <button
          className="btn btn-primary mt-2"
          onClick={() => navigate('/organization-selection')}
        >
          Go to Organizations
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 className="heading">{selectedOrganization.name}</h2>
        <p className="subtitle" style={{ marginTop: 4 }}>
          Your role: <strong>{selectedOrganization.role}</strong>
        </p>
      </div>

      {/* Members section */}
      <div>
        <div>
          Members
        </div>

        {membersLoading ? (
          <Loading />
        ) : members.length === 0 ? (
          <p>No members found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id}>
                  <td>{member.firstName} {member.lastName}</td>
                  <td>{member.email}</td>
                  <td>{member.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
