import { useState, useEffect } from 'react';
import { useReport } from '../ReportContext';
import { PlayCircle, Loader2, Bot, Sliders, Calculator, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const AgentTerminalFeed = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const sequence = [
      "Initializing LangChain multi-agent framework...",
      "Weather Agent: Ingesting meteorological telemetry...",
      "Flood Agent: Calculating topographical inundation depths...",
      "Power Grid Agent: Analyzing infrastructure stress points...",
      "Economics Agent: Estimating asset damage and loss...",
      "Evacuation Agent: Identifying safe routes and relief camps...",
      "Synthesizing intelligence into Mayor's Action Plan...",
      "Awaiting final LLM consensus..."
    ];

    let i = 0;
    setLogs([sequence[0]]);
    i++;

    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLogs(prev => [...prev, sequence[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-2xl border border-blue-50/50 min-h-[400px] w-full relative overflow-hidden flex flex-col items-center py-12"
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
      
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-20 h-20 mb-6">
           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="absolute inset-0 rounded-full border-t-2 border-blue-500 border-r-2 border-transparent opacity-70"></motion.div>
           <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }} className="absolute inset-2 rounded-full border-l-2 border-indigo-400 border-b-2 border-transparent opacity-70"></motion.div>
           <motion.div animate={{ scale: [0.9, 1.1, 0.9] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 flex items-center justify-center">
             <Bot className="w-8 h-8 text-blue-600" />
           </motion.div>
        </div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">AI Agents Processing</h3>
        <p className="text-sm font-medium text-slate-500 mt-2">Running real-time scenario simulation...</p>
      </div>

      <div className="w-full max-w-lg space-y-3 relative z-10 flex flex-col items-center h-64 overflow-y-auto custom-scrollbar pr-2">
          {logs.map((log, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-3 w-full bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 py-3 px-5 rounded-2xl shadow-sm"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
              <span className="text-slate-700 font-semibold text-sm">{log}</span>
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
};

export default function ScenarioSimulator() {
  const { setReport, isLoading, setIsLoading } = useReport();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('meghdoot_simulator_form');
    return saved ? JSON.parse(saved) : {
      rainfall_mm: 120,
      temperature_c: 38.5,
      reservoir_capacity_pct: 45,
      population_density_multiplier: 1.2
    };
  });
  
  const [inputMode, setInputMode] = useState<'expert' | 'citizen' | 'text'>('text');
  const [nlText, setNlText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    localStorage.setItem('meghdoot_simulator_form', JSON.stringify(formData));
  }, [formData]);

  const presets = [
    {
      label: '🌩️ Heavy Monsoon',
      values: { rainfall_mm: 150, temperature_c: 30, reservoir_capacity_pct: 85, population_density_multiplier: 1.0 }
    },
    {
      label: '☀️ Severe Heatwave',
      values: { rainfall_mm: 0, temperature_c: 45, reservoir_capacity_pct: 20, population_density_multiplier: 1.2 }
    },
    {
      label: '🌊 Urban Flash Flood',
      values: { rainfall_mm: 250, temperature_c: 28, reservoir_capacity_pct: 100, population_density_multiplier: 1.5 }
    }
  ];

  const getRainfallLabel = (val: number) => {
    if (val < 20) return "Dry";
    if (val < 80) return "Light Drizzle";
    if (val < 180) return "Heavy Rain";
    return "Extreme Downpour";
  };

  const getTempLabel = (val: number) => {
    if (val < 25) return "Cool";
    if (val < 35) return "Normal";
    if (val < 42) return "Hot";
    return "Severe Heat";
  };

  const getReservoirLabel = (val: number) => {
    if (val < 25) return "Empty";
    if (val < 70) return "Half";
    if (val < 95) return "Full";
    return "Overflowing";
  };

  const getPopLabel = (val: number) => {
    if (val < 0.8) return "Deserted";
    if (val < 1.2) return "Normal";
    if (val < 1.6) return "Crowded";
    return "Festival Surge";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: parseFloat(e.target.value) || 0
    }));
  };

  const runSimulation = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Agents analyzing scenario...');
    try {
      const response = await fetch(`${API_URL}/simulate-scenario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        setReport(data);
        toast.success('Simulation Complete!', { id: toastId });
        setTimeout(() => navigate('/mayor'), 600);
      } else {
        toast.error('Simulation failed.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Error connecting to backend.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNLParse = async () => {
    if (!nlText.trim()) return;
    setIsAnalyzing(true);
    const toastId = toast.loading('AI analyzing text...');
    try {
      const response = await fetch(`${API_URL}/parse-nl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: nlText })
      });
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        toast.success('Parameters Auto-Filled!', { id: toastId });
        setInputMode('citizen'); // Switch back to see the results
      } else {
        toast.error('AI parsing failed.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Error connecting to AI engine.', { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-8 max-w-4xl mx-auto"
    >
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Scenario Simulator</h2>
        <p className="text-slate-500 mt-2">Inject parameters and trigger the multi-agent AI engine.</p>
      </header>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        
        {isLoading ? (
          <AgentTerminalFeed />
        ) : (
          <>
            {/* Mode Selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
          <button
            onClick={() => setInputMode('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-sm transition-all ${inputMode === 'text' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >
            <MessageSquare className="w-4 h-4" /> AI Chat Input
          </button>
          <button
            onClick={() => setInputMode('citizen')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-sm transition-all ${inputMode === 'citizen' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >
            <Sliders className="w-4 h-4" /> Slider Mode
          </button>
          <button
            onClick={() => setInputMode('expert')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-sm transition-all ${inputMode === 'expert' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >
            <Calculator className="w-4 h-4" /> Expert Mode
          </button>
        </div>

        {/* Text Input Mode */}
        {inputMode === 'text' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
              <label className="block text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-600" />
                Describe the situation in plain English
              </label>
              <textarea
                value={nlText}
                onChange={(e) => setNlText(e.target.value)}
                placeholder="e.g., 'It has been raining extremely heavily for two days, and the reservoirs are completely overflowing. It is also quite hot.'"
                className="w-full h-32 px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 outline-none resize-none mb-4 text-slate-700 placeholder:text-slate-400"
              />
              <button
                onClick={handleNLParse}
                disabled={isAnalyzing || !nlText.trim()}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-70"
              >
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
                {isAnalyzing ? 'AI is Parsing...' : 'Analyze & Auto-Fill Sliders'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Expert Mode (Raw Inputs) */}
        {inputMode === 'expert' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Rainfall (mm/24h)</label>
              <input type="number" name="rainfall_mm" value={formData.rainfall_mm} onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Temperature (°C)</label>
              <input type="number" name="temperature_c" value={formData.temperature_c} onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Reservoir Capacity (%)</label>
              <input type="number" name="reservoir_capacity_pct" value={formData.reservoir_capacity_pct} onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Pop. Density Multiplier</label>
              <input type="number" name="population_density_multiplier" value={formData.population_density_multiplier} onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </motion.div>
        )}

        {/* Citizen Mode (Sliders) */}
        {inputMode === 'citizen' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Presets Row */}
            <div className="mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-3">Quick Presets</label>
          <div className="flex flex-wrap gap-3">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setFormData(preset.values)}
                className="px-4 py-2 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 rounded-lg text-sm font-semibold transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 mb-10">
          {/* Rainfall */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="block text-sm font-bold text-slate-700">Rainfall</label>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">{formData.rainfall_mm} mm</span>
            </div>
            <p className="text-lg font-medium text-slate-600">{getRainfallLabel(formData.rainfall_mm)}</p>
            <input type="range" name="rainfall_mm" min="0" max="300" step="5" value={formData.rainfall_mm} onChange={handleChange}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
          </div>
          
          {/* Temperature */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="block text-sm font-bold text-slate-700">Temperature</label>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">{formData.temperature_c}°C</span>
            </div>
            <p className="text-lg font-medium text-slate-600">{getTempLabel(formData.temperature_c)}</p>
            <input type="range" name="temperature_c" min="20" max="50" step="0.5" value={formData.temperature_c} onChange={handleChange}
              className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
          </div>
          
          {/* Reservoir Capacity */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="block text-sm font-bold text-slate-700">Reservoir Capacity</label>
              <span className="bg-cyan-100 text-cyan-800 text-xs font-bold px-2 py-1 rounded">{formData.reservoir_capacity_pct}%</span>
            </div>
            <p className="text-lg font-medium text-slate-600">{getReservoirLabel(formData.reservoir_capacity_pct)}</p>
            <input type="range" name="reservoir_capacity_pct" min="0" max="120" step="5" value={formData.reservoir_capacity_pct} onChange={handleChange}
              className="w-full accent-cyan-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
          </div>
          
          {/* Population Density */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="block text-sm font-bold text-slate-700">Population Density</label>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded">{formData.population_density_multiplier}x</span>
            </div>
            <p className="text-lg font-medium text-slate-600">{getPopLabel(formData.population_density_multiplier)}</p>
            <input type="range" name="population_density_multiplier" min="0.5" max="2.5" step="0.1" value={formData.population_density_multiplier} onChange={handleChange}
              className="w-full accent-indigo-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>
        </motion.div>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100">
          <button 
            onClick={runSimulation}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-sm disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <PlayCircle className="w-6 h-6" />}
            {isLoading ? 'Agents Analyzing...' : 'Run Scenario'}
          </button>
        </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
