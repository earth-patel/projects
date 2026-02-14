import Loading from '../components/Loading';
import { useAppSelector } from '../store/index';

const Dashboard = () => {
  const { authLoading, user } = useAppSelector(state => state.auth);

  if (authLoading || !user) return <Loading />;

  return <div>Dashboard</div>;
};

export default Dashboard;
