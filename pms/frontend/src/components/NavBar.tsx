import { useNavigate } from 'react-router';

import { logout } from '../store/auth/auth.slice';
import { useAppDispatch, useAppSelector } from '../store/index';

const NavBar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);

  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="user-info">
          <div className="title">
            {user?.firstName} {user?.lastName}
          </div>
          <div className="subtitle">{user?.email}</div>
        </div>
      </div>

      <div>
        <button className="btn btn-secondary me-1" onClick={() => navigate('/organization-selection')}>
          Switch Org
        </button>
        <button className="btn btn-danger" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavBar;
