import { Outlet } from 'react-router';

import NavBar from '../components/NavBar';

const ProtectedLayout = () => {
  return (
    <>
      <NavBar />

      <div>
        <Outlet />
      </div>
    </>
  );
};

export default ProtectedLayout;
