// layouts/AppLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AppLayout = () => {
  return (
    <div>
      <Sidebar />
      <main className='flex'>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
