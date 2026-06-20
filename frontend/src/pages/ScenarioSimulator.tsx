import { useState } from 'react';
import { useReport } from '../ReportContext';
import { PlayCircle, Loader2 } from 'lucide-react';

export default function ScenarioSimulator() {
  const { setReport, isLoading, setIsLoading } = useReport();
  const [formData, setFormData] = useState({
    rainfall_mm: 120,
    temperature_c: 38.5,
    reservoir_capacity_pct: 45,
    population_density_multiplier: 1.2
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: parseFloat(e.target.value) || 0
    }));
  };

  const runSimulation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/simulate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        setReport(data);
        alert('Simulation Complete! Check the Dashboard for insights.');
      } else {
        alert('Simulation failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Scenario Simulator</h2>
        <p className="text-slate-500 mt-2">Inject parameters and trigger the multi-agent AI engine.</p>
      </header>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Rainfall (mm/24h)</label>
            <input type="number" name="rainfall_mm" value={formData.rainfall_mm} onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
            <p className="text-xs text-slate-400 mt-1">Expected precipitation.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Temperature (°C)</label>
            <input type="number" name="temperature_c" value={formData.temperature_c} onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
            <p className="text-xs text-slate-400 mt-1">Average daytime temperature.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Reservoir Capacity (%)</label>
            <input type="number" name="reservoir_capacity_pct" value={formData.reservoir_capacity_pct} onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
            <p className="text-xs text-slate-400 mt-1">Current water availability.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Pop. Density Multiplier</label>
            <input type="number" name="population_density_multiplier" value={formData.population_density_multiplier} onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
            <p className="text-xs text-slate-400 mt-1">Festival/Event surge (1.0 = normal).</p>
          </div>
        </div>

        <button 
          onClick={runSimulation}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-sm disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <PlayCircle className="w-6 h-6" />}
          {isLoading ? 'Agents Analyzing...' : 'Run Scenario'}
        </button>
      </div>
    </div>
  );
}
