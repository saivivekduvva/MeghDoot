import { useReport } from '../ReportContext';
import { ShieldCheck, ArrowDownRight, AlertOctagon } from 'lucide-react';

export default function MayorDashboard() {
  const { report } = useReport();
  const { recommended_actions, expected_impact_reduction, metrics } = report;

  if (!recommended_actions || recommended_actions.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center h-full text-slate-500">
        Run a simulation to generate the Mayor's Action Plan.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Executive Action Plan</h2>
          <p className="text-slate-500 mt-2">Prioritized recommendations coordinated by the Mayor Agent.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Affected Pop.</p>
          <p className="text-2xl font-bold text-red-600">{metrics.affected_population.toLocaleString()}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-green-600" /> Recommended Actions
          </h3>
          {recommended_actions.map((action, idx) => (
            <div key={idx} className={`p-5 rounded-xl border flex items-center justify-between shadow-sm bg-white ${action.priority_level === 'CRITICAL' ? 'border-red-300' : 'border-slate-200'}`}>
              <div className="flex items-center gap-4">
                <div className="font-bold text-lg text-slate-400 w-6">{idx + 1}.</div>
                <p className="text-slate-800 font-medium">{action.action_text}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${action.priority_level === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                {action.priority_level}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ArrowDownRight className="w-5 h-5" /> Expected Impact Reduction
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-blue-200 text-sm">Flood Exposure</p>
                <p className="text-3xl font-bold">-{expected_impact_reduction?.flood_exposure_reduced_pct || 0}%</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Economic Loss</p>
                <p className="text-3xl font-bold">-{expected_impact_reduction?.economic_loss_reduced_pct || 0}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 p-5 rounded-xl">
            <div className="flex gap-3">
              <AlertOctagon className="w-6 h-6 text-orange-600 shrink-0" />
              <div>
                <h4 className="font-bold text-orange-800">Est. Economic Loss</h4>
                <p className="text-orange-900 mt-1 font-semibold text-xl">₹{metrics.economic_loss_estimate.toFixed(2)} Crores</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
