import { useState } from 'react';
import { Home, CloudRain, AlertTriangle, Users, Map, Search, User, LogOut, Settings as SettingsIcon, UserCircle, PanelLeft, Info, X, Shield, Cpu, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const TopNavbar = ({ toggleLeftSidebar }: { toggleLeftSidebar?: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: CloudRain, label: 'Simulation', path: '/simulator' },
    { icon: AlertTriangle, label: 'Risk Map', path: '/risk-map' },
    { icon: Map, label: 'Safe Route', path: '/safe-route' },
    { icon: Users, label: 'Citizen SOS', path: '/citizen-reports' },
  ];

  return (
    <>
      <div className="w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm z-40 relative flex-shrink-0">
        <div className="w-full px-8">
        {/* Top Row: Title & Actions */}
        <div className="flex justify-between items-center py-6">
          
          {/* Left: Sidebar Toggle */}
          <div className="flex items-center">
            <motion.button 
              onClick={toggleLeftSidebar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
              title="Toggle AI Telemetry Panel"
            >
              <PanelLeft className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Center: Massive Title */}
          <div className="flex items-center absolute left-1/2 -translate-x-1/2">
            <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tighter drop-shadow-sm pb-1">MeghDoot</h1>
          </div>

          {/* Right: Search & Profile */}
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                className="bg-slate-100 border-none text-slate-700 text-sm rounded-full focus:ring-2 focus:ring-blue-500 block w-48 xl:w-64 pl-10 p-2.5 outline-none transition-all focus:w-72"
                placeholder="Search scenarios..."
              />
            </div>

            <motion.button 
              onClick={() => setIsAboutOpen(true)}
              whileHover={{ scale: 1.05 }} 
              className="relative p-2.5 bg-slate-100 rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
              title="About MeghDoot"
            >
              <Info className="w-5 h-5" />
            </motion.button>

            <div className="relative">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] cursor-pointer shadow-sm"
              >
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
              </motion.div>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <p className="text-sm font-bold text-slate-800">Commander Admin</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">admin@meghdoot.gov</p>
                    </div>
                    <button className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2"><UserCircle className="w-4 h-4" /> My Profile</button>
                    <button className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2"><SettingsIcon className="w-4 h-4" /> Settings</button>
                    <div className="border-t border-slate-50 mt-1 pt-1">
                      <button className="w-full px-4 py-2.5 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"><LogOut className="w-4 h-4" /> Sign Out</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Row: Horizontal Navigation Links */}
        <nav className="flex justify-center items-center gap-3 pb-6 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                  isActive 
                    ? 'text-blue-700 bg-blue-100 shadow-sm border border-blue-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : ''}`} />
                {item.label}
              </motion.button>
            );
          })}
        </nav>
        </div>
      </div>

      {/* About Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-[90%] max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <button 
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="bg-slate-50 p-8 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <CloudRain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">MeghDoot</h2>
                    <p className="text-blue-600 font-bold tracking-widest uppercase mt-1">Multi-Agent Climate Intelligence Command Center</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <p className="text-slate-600 leading-relaxed text-lg text-justify font-medium">
                  Designed to predict, simulate, and mitigate severe environmental disasters, MeghDoot bridges the gap between predictive intelligence and rapid real-world execution.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Cpu className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-bold text-slate-800">Autonomous Architecture</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Powered by Google Gemini and LangChain, the platform coordinates specialized AI agents (Weather, Flood, Power Grid, Economics, and Evacuation) running real-time parallel risk simulations.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Activity className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-bold text-slate-800">Live Mitigation</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Our premium dashboard aggregates agent outputs into live telemetries, presenting critical recommendations. Operators can instantly authorize emergency relief measures directly from the interface.
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <Shield className="w-4 h-4 text-blue-500" /> Authorized Government Use Only
                  </div>
                  <div className="text-sm text-slate-400 font-medium">
                    System Version 2.0.4
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopNavbar;
