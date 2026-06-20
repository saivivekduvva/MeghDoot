import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

const scenarios = [
  { id: 1, name: 'Cyclone Amphan 2.0', base: 90, flood: 85, heat: 15, water: 20, infra: 75, confidence: 92 },
  { id: 2, name: 'Heatwave 2026', base: 45, flood: 5, heat: 95, water: 80, infra: 60, confidence: 88 },
  { id: 3, name: 'Urban Flash Flood', base: 70, flood: 90, heat: 10, water: 5, infra: 85, confidence: 75 },
];

const getPillColor = (value: number) => {
  if (value > 80) return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  if (value > 60) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  if (value > 30) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
};

const getReasoning = (_metric: string, value: number) => {
  if (value > 80) return `Critical alert triggered. AI detects anomalous patterns matching historical disasters. High confidence in severe impact.`;
  if (value > 60) return `Elevated risk detected. Primary drivers indicate developing threat. Close monitoring advised.`;
  return `Nominal levels. No immediate threat detected by agent models.`;
};

interface RiskPillProps {
  value: number;
  metric: string;
}

const RiskPill = ({ value, metric }: RiskPillProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex justify-center items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className={`px-4 py-2 rounded-full border text-sm font-semibold cursor-help transition-colors ${getPillColor(value)}`}
      >
        {value}%
      </motion.div>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full mb-2 w-64 p-3 glass-panel z-50 rounded-xl shadow-2xl border-white/60"
          >
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-700 font-medium mb-1">AI Reasoning ({metric})</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {getReasoning(metric, value)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ScenariosTable = () => {
  const columns = ['Scenario', 'Baseline', 'Flood Risk', 'Heatwave', 'Water Scarcity', 'Infra Stress', 'Confidence'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-panel p-6 flex-1 overflow-x-auto"
    >
      <h2 className="text-xl font-bold text-slate-900 mb-6">Predictive Risk Pipeline</h2>
      
      <div className="min-w-[800px]">
        <div className="grid grid-cols-7 gap-4 mb-4 pb-4 border-b border-slate-200 text-sm font-medium text-slate-500">
          {columns.map((col, idx) => (
            <div key={idx} className={idx === 0 ? 'text-left pl-2' : 'text-center'}>{col}</div>
          ))}
        </div>

        <div className="space-y-3">
          {scenarios.map((scenario, idx) => (
            <motion.div 
              key={scenario.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + (idx * 0.1) }}
              className="grid grid-cols-7 gap-4 items-center p-3 rounded-2xl hover:bg-slate-200/50 transition-colors"
            >
              <div className="font-medium text-slate-700 pl-2">{scenario.name}</div>
              <RiskPill value={scenario.base} metric="Baseline" />
              <RiskPill value={scenario.flood} metric="Flood Risk" />
              <RiskPill value={scenario.heat} metric="Heatwave" />
              <RiskPill value={scenario.water} metric="Water Scarcity" />
              <RiskPill value={scenario.infra} metric="Infra Stress" />
              <RiskPill value={scenario.confidence} metric="Confidence" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ScenariosTable;
