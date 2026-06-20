import { useReport } from '../ReportContext';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function CityOverview() {
  const { report } = useReport();
  const { metrics } = report;

  const RiskCard = ({ title, value, unit = '%' }: { title: string, value: number, unit?: string }) => {
    const isHigh = value > 70;
    const isMedium = value > 40 && value <= 70;
    
    let colorClass = "bg-green-100 text-green-700 border-green-200";
    let Icon = ShieldCheck;
    if (isHigh) {
      colorClass = "bg-red-100 text-red-700 border-red-200";
      Icon = AlertTriangle;
    } else if (isMedium) {
      colorClass = "bg-orange-100 text-orange-700 border-orange-200";
      Icon = ShieldAlert;
    }

    return (
      <div className={`p-6 rounded-xl border ${colorClass} flex flex-col items-center justify-center text-center shadow-sm`}>
        <Icon className="w-8 h-8 mb-3 opacity-80" />
        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-1">{title}</h3>
        <p className="text-4xl font-bold">{value.toFixed(1)}{unit}</p>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">City Climate Overview</h2>
        <p className="text-slate-500 mt-2">Real-time predictive insights powered by multi-agent AI.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RiskCard title="Flood Risk" value={metrics.flood_risk_pct} />
        <RiskCard title="Heatwave Risk" value={metrics.heatwave_risk_pct} />
        <RiskCard title="Water Scarcity" value={metrics.water_scarcity_risk_pct} />
        <RiskCard title="Infra Stress" value={metrics.infrastructure_stress_pct} />
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">System Confidence</h3>
          <div className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
            {metrics.confidence_score_pct.toFixed(1)}% Validated
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-blue-600 h-4 transition-all duration-1000 ease-out" 
            style={{ width: `${metrics.confidence_score_pct}%` }} 
          />
        </div>
      </div>
    </div>
  );
}
