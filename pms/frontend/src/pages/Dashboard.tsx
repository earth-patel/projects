import Loading from '../components/Loading';
import { useAppSelector } from '../store/index';

const Dashboard = () => {
  const { loading, user } = useAppSelector(state => state.auth);

  if (loading || !user) return <Loading />;

  return <div>Dashboard</div>;
};

export default Dashboard;
