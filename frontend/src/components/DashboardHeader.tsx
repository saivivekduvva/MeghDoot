
import { useState } from 'react';
import { Search, Bell, User, LogOut, Settings as SettingsIcon, UserCircle, PanelRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardHeader = ({ toggleRightSidebar }: { toggleRightSidebar?: () => void }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex justify-between items-center mb-8"
    >
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">MeghDoot</h1>
          <span className="text-slate-300 text-3xl font-light">|</span>
          <h2 className="text-xl font-bold text-slate-700 tracking-tight mt-1">Command Center</h2>
        </div>
        <p className="text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System is monitoring 3 active risk scenarios
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input
            type="text"
            className="glass-card bg-white/60 border border-white text-slate-700 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-64 pl-10 p-2.5 placeholder-slate-400 outline-none transition-all focus:w-72"
            placeholder="Search scenarios or regions..."
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 glass-card rounded-full text-slate-600 hover:text-slate-900"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </motion.button>

        <motion.button 
          onClick={toggleRightSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 glass-card rounded-full text-slate-600 hover:text-slate-900"
          title="Toggle AI Telemetry Panel"
        >
          <PanelRight className="w-5 h-5" />
        </motion.button>

        <div className="relative">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] cursor-pointer"
          >
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-slate-600" />
            </div>
          </motion.div>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100/80 mb-1">
                  <p className="text-sm font-bold text-slate-800">Commander Admin</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">admin@meghdoot.gov</p>
                </div>
                <button 
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <UserCircle className="w-4 h-4" /> My Profile
                </button>
                <button 
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <SettingsIcon className="w-4 h-4" /> Account Settings
                </button>
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button 
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full px-4 py-2.5 text-left text-sm font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
