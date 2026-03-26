import { useNavigate } from 'react-router';

import { logout } from '../store/auth/auth.slice';
import { useAppDispatch, useAppSelector } from '../store/index';

const NavBar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);
  const selectedOrg = useAppSelector(state => state.organization.selectedOrganization);

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

      <div className="user-info text-center">
        <div className="title">
          {selectedOrg?.name}
        </div>
        <div className="subtitle">{selectedOrg?.role}</div>
      </div>

      <div className='d-flex g-1'>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/organization-selection')}
        >
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
