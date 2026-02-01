import { logout } from '../store/auth/auth.slice';
import { useAppDispatch, useAppSelector } from '../store/index';
import { clearOrganizationState } from '../store/organization/organization.slice';

const NavBar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const onLogout = () => {
    dispatch(logout());
    dispatch(clearOrganizationState());
  };

  return (
    <div className="navbar">
      <div>
        <strong>
          {user?.firstName} {user?.lastName}
        </strong>
        <div>{user?.email}</div>
      </div>

      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default NavBar;
