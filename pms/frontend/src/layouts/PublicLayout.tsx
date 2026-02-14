import { Outlet } from 'react-router';

const PublicLayout = () => {
  return (
    <div style={{ margin: '20px' }}>
      <Outlet />
    </div>
  );
};

export default PublicLayout;
