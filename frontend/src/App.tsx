import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Activity, Map, Cpu, ShieldAlert, Sliders } from 'lucide-react';
import CityOverview from './pages/CityOverview';
import RiskMapPage from './pages/RiskMapPage';
import AgentIntelligence from './pages/AgentIntelligence';
import MayorDashboard from './pages/MayorDashboard';
import ScenarioSimulator from './pages/ScenarioSimulator';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">MeghDoot</h1>
          <p className="text-xs text-slate-500 mt-1">Climate Intelligence</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700 font-medium transition-colors">
            <Activity className="w-5 h-5 text-slate-400" /> Overview
          </Link>
          <Link to="/risk-map" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700 font-medium transition-colors">
            <Map className="w-5 h-5 text-slate-400" /> Risk Map
          </Link>
          <Link to="/agents" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700 font-medium transition-colors">
            <Cpu className="w-5 h-5 text-slate-400" /> Agent Intel
          </Link>
          <Link to="/mayor" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700 font-medium transition-colors">
            <ShieldAlert className="w-5 h-5 text-slate-400" /> Mayor Dashboard
          </Link>
          <Link to="/simulate" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700 font-medium transition-colors">
            <Sliders className="w-5 h-5 text-slate-400" /> Simulator
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<CityOverview />} />
          <Route path="/risk-map" element={<RiskMapPage />} />
          <Route path="/agents" element={<AgentIntelligence />} />
          <Route path="/mayor" element={<MayorDashboard />} />
          <Route path="/simulate" element={<ScenarioSimulator />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
