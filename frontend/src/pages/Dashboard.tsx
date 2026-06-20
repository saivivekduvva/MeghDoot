
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import StatCards from '../components/StatCards';
import ScenariosTable from '../components/ScenariosTable';
import RightSidebar from '../components/RightSidebar';

const Dashboard = () => {
  return (
    <div className="flex h-screen w-full p-6">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <StatCards />
          <ScenariosTable />
        </div>
      </div>
      <RightSidebar />
    </div>
  );
};

export default Dashboard;
