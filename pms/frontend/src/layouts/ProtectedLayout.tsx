import { Outlet } from 'react-router';

import NavBar from '../components/NavBar';

const ProtectedLayout = () => {
  return (
    <>
      <NavBar />

      <div style={{ margin: '20px' }}>
        <Outlet />
      </div>
    </>
  );
};

export default ProtectedLayout;
