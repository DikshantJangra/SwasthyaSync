// layouts/AppLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AppLayout = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;