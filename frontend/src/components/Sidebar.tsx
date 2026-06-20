
import { Home, CloudRain, AlertTriangle, Activity, Settings, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const navItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: CloudRain, label: 'Weather Models', active: false },
    { icon: AlertTriangle, label: 'Risk Pipeline', active: false },
    { icon: Activity, label: 'Telemetry', active: false },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-24 h-full flex flex-col items-center py-8 glass-panel border-r border-white mr-6"
    >
      <div className="mb-12 cursor-pointer group">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
          <Hexagon className="w-8 h-8 text-white" />
        </div>
      </div>

      <nav className="flex-1 flex flex-col items-center gap-8">
        {navItems.map((item) => (
          <motion.button
            key={item.label}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-xl transition-all duration-300 relative group ${
              item.active 
                ? 'bg-blue-500/10 text-blue-600' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
            title={item.label}
          >
            {item.active && (
              <motion.div 
                layoutId="active-nav" 
                className="absolute inset-0 bg-blue-500/10 rounded-xl"
              />
            )}
            <item.icon className={`w-6 h-6 ${item.active ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`} />
          </motion.button>
        ))}
      </nav>

      <div className="mt-auto">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition-all duration-300"
        >
          <Settings className="w-6 h-6" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
