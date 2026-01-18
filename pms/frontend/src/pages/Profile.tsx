import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { fetchMe, logout } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/index';

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, token, user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    dispatch(fetchMe());
  }, [dispatch, navigate, token]);

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p>First Name: {user.firstName}</p>
      <p>Last Name: {user.lastName}</p>
      <p>Email: {user.email}</p>
      <button
        onClick={() => {
          dispatch(logout());
          navigate('/login', { replace: true });
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
