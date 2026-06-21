import { useState } from 'react';
import { useReport } from '../ReportContext';
import { ShieldCheck, ArrowDownRight, AlertOctagon, Coins, Wrench, TrendingDown, Zap, PieChart, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from '../components/CountUp';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

export default function MayorDashboard() {
  const { report, rescuedCount } = useReport();
  const { recommended_actions, expected_impact_reduction, metrics, recovery_suggestions } = report;
  const [activeTab, setActiveTab] = useState<'immediate' | 'recovery'>('immediate');

  // Budget Mini-Game State
  const [budgetMed, setBudgetMed] = useState(33);
  const [budgetInf, setBudgetInf] = useState(33);
  const [budgetEvac, setBudgetEvac] = useState(34);

  const handleBudgetChange = (type: string, value: number) => {
    const diff = value - (type === 'med' ? budgetMed : type === 'inf' ? budgetInf : budgetEvac);
    if (type === 'med') {
      setBudgetMed(value);
      setBudgetInf(Math.max(0, budgetInf - diff / 2));
      setBudgetEvac(Math.max(0, budgetEvac - diff / 2));
    } else if (type === 'inf') {
      setBudgetInf(value);
      setBudgetMed(Math.max(0, budgetMed - diff / 2));
      setBudgetEvac(Math.max(0, budgetEvac - diff / 2));
    } else {
      setBudgetEvac(value);
      setBudgetMed(Math.max(0, budgetMed - diff / 2));
      setBudgetInf(Math.max(0, budgetInf - diff / 2));
    }
  };

  const recoverySpeed = Math.min(100, Math.max(10, (budgetMed * 0.8) + (budgetInf * 1.2) + (budgetEvac * 0.9)));

  if (!recommended_actions || recommended_actions.length === 0) {
    return (
      <motion.div 
        initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }}
        className="p-8 flex items-center justify-center h-full text-slate-500"
      >
        Run a simulation to generate the Mayor's Action Plan.
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }}
      className="p-8 max-w-7xl mx-auto space-y-8 pb-32"
    >
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Executive Action Plan</h2>
          <p className="text-slate-500 mt-2">Prioritized recommendations coordinated by the Mayor Agent.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Affected Pop.</p>
          <p className="text-2xl font-bold text-red-600"><CountUp end={metrics.affected_population} duration={1.5} /></p>
        </div>
      </header>

      <div className="flex bg-slate-100 p-1 rounded-xl w-fit mb-6">
        <button
          onClick={() => setActiveTab('immediate')}
          className={`flex items-center gap-2 py-2.5 px-6 rounded-lg font-bold text-sm transition-all ${activeTab === 'immediate' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Zap className="w-4 h-4" /> Immediate Response
        </button>
        <button
          onClick={() => setActiveTab('recovery')}
          className={`flex items-center gap-2 py-2.5 px-6 rounded-lg font-bold text-sm transition-all ${activeTab === 'recovery' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Wrench className="w-4 h-4" /> Build Back Better (Recovery)
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Main Content Area */}
        <motion.div variants={listVariants} initial="hidden" animate="show" className="col-span-2 space-y-4">
          
          {activeTab === 'immediate' && (
            <>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                <ShieldCheck className="w-6 h-6 text-blue-600" /> Recommended Actions
              </h3>
              {recommended_actions.map((action, idx) => (
                <motion.div variants={itemVariants} key={idx} className={`p-5 rounded-xl border flex items-center justify-between shadow-sm bg-white ${action.priority_level === 'CRITICAL' ? 'border-red-300' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className="font-bold text-lg text-slate-400 w-6">{idx + 1}.</div>
                    <p className="text-slate-800 font-medium">{action.action_text}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${action.priority_level === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                    {action.priority_level}
                  </span>
                </motion.div>
              ))}
            </>
          )}

          {activeTab === 'recovery' && (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Wrench className="w-6 h-6 text-emerald-600" /> Resilient Infrastructure Upgrades
                </h3>
                <p className="text-slate-500 mt-1 text-sm">Long-term AI architectural suggestions to mitigate future economic loss.</p>
              </div>

              {recovery_suggestions && recovery_suggestions.length > 0 ? (
                recovery_suggestions.map((suggestion, idx) => (
                  <motion.div variants={itemVariants} key={idx} className="p-6 rounded-2xl border border-emerald-100 bg-white shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-2 rounded-bl-xl border-b border-l border-emerald-100">
                      -{suggestion.risk_reduction_pct}% Future Risk
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Original Asset</p>
                        <p className="text-rose-700 font-medium line-through decoration-rose-300 decoration-2">{suggestion.original_asset}</p>
                      </div>
                      <div>
                        <p className="text-xs text-emerald-500 uppercase tracking-wider font-bold mb-1 flex items-center gap-1"><TrendingDown className="w-3 h-3"/> AI Upgrade Suggestion</p>
                        <p className="text-emerald-900 font-bold">{suggestion.upgrade_suggestion}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <p className="text-sm text-slate-500">Estimated Upgrade Cost</p>
                      <p className="font-bold text-slate-700">₹{suggestion.upgrade_cost_crores.toFixed(2)} Cr</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  No long-term recovery suggestions generated for this scenario.
                </div>
              )}
            </>
          )}

        </motion.div>

        {/* Right Sidebar Stats Area */}
        <div className="space-y-6">
          
          {rescuedCount > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20"
            >
              <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                <HeartHandshake className="w-6 h-6" /> Live Rescue Operations
              </h3>
              <p className="text-emerald-100 text-sm mb-4 font-medium">Citizens secured via SOS dispatch</p>
              <div className="flex items-baseline gap-2">
                <p className="text-6xl font-black tracking-tighter drop-shadow-sm">
                  <CountUp end={rescuedCount} duration={2} />
                </p>
                <p className="text-emerald-200 font-bold uppercase tracking-wider text-sm">Rescued</p>
              </div>
            </motion.div>
          )}

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ArrowDownRight className="w-5 h-5" /> Expected Impact Reduction
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-blue-200 text-sm">Flood Exposure</p>
                <p className="text-3xl font-bold">
                  -<CountUp end={expected_impact_reduction?.flood_exposure_reduced_pct || 0} suffix="%" />
                </p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Economic Loss</p>
                <p className="text-3xl font-bold">
                  -<CountUp end={expected_impact_reduction?.economic_loss_reduced_pct || 0} suffix="%" />
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 p-5 rounded-xl">
            <div className="flex gap-3">
              <AlertOctagon className="w-6 h-6 text-orange-600 shrink-0" />
              <div>
                <h4 className="font-bold text-orange-800">Est. Economic Loss</h4>
                <p className="text-orange-900 mt-1 font-semibold text-xl">
                  <CountUp prefix="₹" end={metrics.economic_loss_estimate} decimals={2} suffix=" Crores" />
                </p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Coins className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="font-bold text-emerald-800">Relief Allocation</h4>
            </div>
            <div className="space-y-3">
              {report.relief_allocations?.map((alloc, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-emerald-700 font-medium">{alloc.category}</span>
                  <span className="text-emerald-900 font-bold bg-emerald-200/50 px-2 py-1 rounded">₹{alloc.amount_crores.toFixed(2)} Cr</span>
                </div>
              ))}
              {(!report.relief_allocations || report.relief_allocations.length === 0) && (
                <p className="text-sm text-emerald-700/60">No allocations suggested.</p>
              )}
            </div>
          </div>

          {/* Interactive Budget Balancer */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Interactive Budget Allocator</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Medical & Rescue</span>
                  <span>{Math.round(budgetMed)}%</span>
                </div>
                <input type="range" min="0" max="100" value={budgetMed} onChange={(e) => handleBudgetChange('med', parseInt(e.target.value))} className="w-full accent-rose-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Infrastructure Repair</span>
                  <span>{Math.round(budgetInf)}%</span>
                </div>
                <input type="range" min="0" max="100" value={budgetInf} onChange={(e) => handleBudgetChange('inf', parseInt(e.target.value))} className="w-full accent-amber-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Evacuation & Camps</span>
                  <span>{Math.round(budgetEvac)}%</span>
                </div>
                <input type="range" min="0" max="100" value={budgetEvac} onChange={(e) => handleBudgetChange('evac', parseInt(e.target.value))} className="w-full accent-blue-500" />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Projected Recovery Speed</p>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2.5 rounded-full" 
                  animate={{ width: `${recoverySpeed}%` }}
                  transition={{ type: 'spring', bounce: 0.4 }}
                ></motion.div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
