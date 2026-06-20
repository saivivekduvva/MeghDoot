import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import RightSidebar from './RightSidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex h-screen w-full p-6 overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <Outlet />
        </div>
      </div>
      <RightSidebar />
    </div>
  );
};

export default Layout;
