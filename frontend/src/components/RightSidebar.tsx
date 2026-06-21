
import { motion } from 'framer-motion';
import { CloudRain, Waves, ThermometerSun, ShieldAlert, Navigation, Plus, Zap, X, PieChart } from 'lucide-react';
import toast from 'react-hot-toast';

const agents = [
  { name: 'Weather Agent', status: 'active', icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { name: 'Flood Agent', status: 'computing', icon: Waves, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { name: 'Economics Agent', status: 'computing', icon: PieChart, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { name: 'Heatwave Agent', status: 'standby', icon: ThermometerSun, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { name: 'Evacuation Agent', status: 'active', icon: Navigation, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
];

const actions = [
  { id: 1, title: 'Deploy Rescue Teams', location: 'Zone A - Low Lying', priority: 'CRITICAL', icon: ShieldAlert, color: 'rose' },
  { id: 2, title: 'Issue Evacuation Alert', location: 'Coastal Districts', priority: 'HIGH', icon: Zap, color: 'amber' },
  { id: 3, title: 'Medical Supply Drop', location: 'Sector 4', priority: 'MEDIUM', icon: Plus, color: 'blue' },
];

const RightSidebar = ({ onClose, className = '' }: { onClose?: () => void, className?: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -350 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -350 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0 }}
      className={`absolute left-8 top-6 bottom-6 w-80 flex flex-col gap-6 z-50 shrink-0 overflow-y-auto custom-scrollbar ${className}`}
    >
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute -right-4 top-4 p-2 bg-white text-slate-500 hover:text-slate-900 rounded-full shadow-md border border-slate-100 transition-all z-50"
          title="Close AI Panel"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* AI Telemetry */}
      <div className="glass-panel p-6 flex-1 shadow-2xl backdrop-blur-2xl bg-white/95">
        <h3 className="text-lg font-bold text-slate-900 mb-6">AI Telemetry</h3>
        <div className="space-y-4">
          {agents.map((agent, idx) => (
            <motion.div 
              key={agent.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (idx * 0.1) }}
              className="flex items-center gap-4 p-3 rounded-2xl bg-white/60 hover:bg-white/80 transition-colors border border-white/60 group"
            >
              <div className={`relative p-3 rounded-xl ${agent.bg}`}>
                <agent.icon className={`w-5 h-5 ${agent.color}`} />
                {agent.status === 'computing' && (
                  <span className="absolute inset-0 rounded-xl border border-indigo-400 animate-ping opacity-75"></span>
                )}
                {agent.status === 'active' && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">{agent.name}</p>
                <p className="text-xs text-slate-500 capitalize flex items-center gap-1 mt-0.5">
                  {agent.status === 'computing' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>}
                  {agent.status}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Center */}
      <div className="glass-panel p-6 flex-1 shadow-2xl backdrop-blur-2xl bg-white/95">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Critical Actions</h3>
        <div className="space-y-4">
          {actions.map((action, idx) => (
            <motion.div 
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + (idx * 0.1) }}
              className={`p-4 rounded-2xl border bg-gradient-to-br from-${action.color}-500/10 to-transparent border-${action.color}-500/20 relative overflow-hidden group`}
            >
              {action.priority === 'CRITICAL' && (
                <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500 animate-ping m-3"></div>
              )}
              <div className="flex gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-${action.color}-500/20 h-fit`}>
                  <action.icon className={`w-4 h-4 text-${action.color}-400`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">{action.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{action.location}</p>
                </div>
              </div>
              <button 
                onClick={() => toast.success(`Command Sent: ${action.title} initiated for ${action.location}!`)}
                className={`w-full py-2 rounded-xl text-xs font-semibold bg-${action.color}-500/10 text-${action.color}-600 hover:bg-${action.color}-500 hover:text-white transition-all duration-300 cursor-pointer`}
              >
                Deploy Action
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RightSidebar;

