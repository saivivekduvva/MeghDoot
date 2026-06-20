import { useReport } from '../ReportContext';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

export default function RiskMapPage() {
  const { report } = useReport();
  const { metrics } = report;

  // Center on a dummy location (e.g., Mumbai coords for a typical Indian city hackathon context)
  const center: [number, number] = [19.0760, 72.8777];

  // Dummy zones based on the current risks
  const zones = [
    { name: "Zone A (Lowlands)", pos: [19.08, 72.88] as [number, number], baseRisk: metrics.flood_risk_pct },
    { name: "Zone B (Urban Core)", pos: [19.06, 72.87] as [number, number], baseRisk: metrics.heatwave_risk_pct },
    { name: "Zone C (Industrial)", pos: [19.09, 72.89] as [number, number], baseRisk: metrics.infrastructure_stress_pct },
  ];

  const getColor = (risk: number) => {
    if (risk > 70) return '#ef4444'; // Red
    if (risk > 40) return '#f97316'; // Orange
    return '#22c55e'; // Green
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      <div className="p-6 bg-white border-b border-slate-200 z-10">
        <h2 className="text-2xl font-bold text-slate-800">GIS Risk Map</h2>
        <p className="text-sm text-slate-500">Interactive visualization of vulnerable regions based on current simulation.</p>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-green-500"></span> Safe</div>
          <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Moderate Risk</div>
          <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-red-500"></span> High Risk</div>
        </div>
      </div>
      <div className="flex-1 bg-slate-100 relative z-0">
        <MapContainer center={center} zoom={12} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {zones.map((zone, idx) => (
            <Circle
              key={idx}
              center={zone.pos}
              pathOptions={{ fillColor: getColor(zone.baseRisk), color: getColor(zone.baseRisk) }}
              radius={1500 + (zone.baseRisk * 10)}
            >
              <Popup>
                <strong>{zone.name}</strong><br />
                Risk Level: {zone.baseRisk.toFixed(1)}%
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>
    </motion.div>
  );
}
