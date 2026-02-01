import Loading from '../components/Loading';
import NavBar from '../components/NavBar';
import OrganizationList from '../components/OrganizationList';
import { useAppSelector } from '../store/index';

const Dashboard = () => {
  const { loading, user } = useAppSelector(state => state.auth);

  if (loading || !user) return <Loading />;

  return (
    <>
      <NavBar />

      <div style={{ padding: '20px' }}>
        <OrganizationList />

        <button style={{ marginTop: '20px' }}>Create Organization</button>
      </div>
    </>
  );
};

export default Dashboard;
