
import { Search, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex justify-between items-center mb-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Good morning, Commander</h1>
        <p className="text-slate-500 mt-1 flex items-center gap-2">
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

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] cursor-pointer"
        >
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-slate-600" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
