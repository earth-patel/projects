import Loading from '../components/Loading';
import { logout } from '../store/auth/auth.slice';
import { useAppDispatch, useAppSelector } from '../store/index';

const Profile = () => {
  const dispatch = useAppDispatch();
  const { loading, user } = useAppSelector(state => state.auth);

  if (loading || !user) return <Loading />;

  return (
    <>
      <h2>Profile</h2>
      <div>
        <p>First Name: {user.firstName}</p>
        <p>Last Name: {user.lastName}</p>
        <p>Email: {user.email}</p>
        <button onClick={() => dispatch(logout())}>Logout</button>
      </div>
    </>
  );
};

export default Profile;
