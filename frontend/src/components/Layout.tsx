import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import RightSidebar from './RightSidebar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useReport } from '../ReportContext';
import { Activity, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Layout = () => {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const { report } = useReport();
  const navigate = useNavigate();
  const location = useLocation();
  const hasSimulationData = report.agent_reasoning && report.agent_reasoning.length > 0;
  return (
    <div className="flex h-screen w-full p-6 overflow-hidden bg-slate-50 relative">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <DashboardHeader toggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)} />
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <Outlet />
        </div>
      </div>
      <AnimatePresence>
        {isRightSidebarOpen && <RightSidebar onClose={() => setIsRightSidebarOpen(false)} />}
      </AnimatePresence>
      
      <AnimatePresence>
        {hasSimulationData && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur-xl p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/60 z-50"
          >
            <button
              onClick={() => navigate('/telemetry')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                location.pathname === '/telemetry' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-600 ring-offset-2 ring-offset-slate-50' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Activity className="w-5 h-5" />
              Agent Telemetry
            </button>
            <div className="w-[1px] h-8 bg-slate-200"></div>
            <button
              onClick={() => navigate('/mayor')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                location.pathname === '/mayor' 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-500/30 ring-2 ring-green-600 ring-offset-2 ring-offset-slate-50' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              Mayor's Action Plan
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
