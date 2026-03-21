import { useNavigate } from 'react-router';

import Loading from '../components/Loading';
import { useAppSelector } from '../store/index';

const Dashboard = () => {
  const navigate = useNavigate();
  const { authLoading, user } = useAppSelector(state => state.auth);
  const { selectedOrganization } = useAppSelector(state => state.organization);

  if (authLoading || !user) return <Loading />;

  // Shouldn't normally happen, but guard against direct URL access
  if (!selectedOrganization) {
    return (
      <div className="container">
        <h2 className='heading'>No organization selected</h2>
        <button className='btn btn-primary mt-2' onClick={() => navigate('/organization-selection')}>
          Go to Organizations
        </button>
      </div>
    )
  }

  return (
    <div className="container">
      <h2 className="heading">{selectedOrganization.name}</h2>
      <p className="subtitle" style={{ marginTop: 4 }}>
        Your role: <strong>{selectedOrganization.role}</strong>
      </p>
    </div>
  );
};

export default Dashboard;
