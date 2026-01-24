import { useEffect } from 'react';
import { RouterProvider } from 'react-router';

import './index.css';
import router from './routes/routes';
import { fetchMe } from './store/auth/auth.thunk';
import { useAppDispatch } from './store/index';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) dispatch(fetchMe(token as string));
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
