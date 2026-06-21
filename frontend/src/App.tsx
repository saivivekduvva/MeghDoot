
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ScenarioSimulator from './pages/ScenarioSimulator';
import RiskMapPage from './pages/RiskMapPage';
import AgentIntelligence from './pages/AgentIntelligence';
import MayorDashboard from './pages/MayorDashboard';
import CitizenReports from './pages/CitizenReports';
import SafeRoute from './pages/SafeRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/simulator" element={<ScenarioSimulator />} />
            <Route path="/risk-map" element={<RiskMapPage />} />
            <Route path="/telemetry" element={<AgentIntelligence />} />
            <Route path="/mayor" element={<MayorDashboard />} />
            <Route path="/citizen-reports" element={<CitizenReports />} />
            <Route path="/safe-route" element={<SafeRoute />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;

