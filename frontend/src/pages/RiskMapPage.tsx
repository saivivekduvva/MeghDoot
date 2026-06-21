import { useReport } from '../ReportContext';
import { MapContainer, TileLayer, Circle, Popup, ImageOverlay } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

export default function RiskMapPage() {
  const { report } = useReport();
  const { metrics } = report;

  // Center on a dummy location (e.g., Mumbai coords for a typical Indian city hackathon context)
  const center: [number, number] = [19.0760, 72.8777];

  // Safely extract metrics, defaulting to low values if no simulation has been run yet
  const floodRisk = metrics?.flood_risk_pct || 15;
  const heatRisk = metrics?.heatwave_risk_pct || 25;
  const infraRisk = metrics?.infrastructure_stress_pct || 10;

  // Dummy zones based on the current risks
  const zones = [
    { name: "Zone A (Lowlands)", pos: [19.08, 72.88] as [number, number], baseRisk: floodRisk },
    { name: "Zone B (Urban Core)", pos: [19.06, 72.87] as [number, number], baseRisk: heatRisk },
    { name: "Zone C (Industrial)", pos: [19.09, 72.89] as [number, number], baseRisk: infraRisk },
  ];

  const getColorId = (risk: number) => {
    if (risk > 70) return 'url(#glow-red)';
    if (risk > 40) return 'url(#glow-orange)';
    return 'url(#glow-green)';
  };

  const AnimatedRadar = () => {
    const [offset, setOffset] = useState(-0.15);

    useEffect(() => {
      const interval = setInterval(() => {
        setOffset(prev => prev > 0.15 ? -0.15 : prev + 0.0003);
      }, 100);
      return () => clearInterval(interval);
    }, []);

    const bounds = [
      [center[0] - 0.08 + (offset/2), center[1] - 0.08 + offset],
      [center[0] + 0.08 + (offset/2), center[1] + 0.08 + offset]
    ] as [[number, number], [number, number]];

    const radarUrl = "https://upload.wikimedia.org/wikipedia/commons/0/07/Hurricane_Katrina_LA_landfall_radar.gif";

    return <ImageOverlay url={radarUrl} bounds={bounds} opacity={0.65} />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col relative"
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <radialGradient id="glow-red" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9"/>
            <stop offset="30%" stopColor="#ef4444" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0"/>
          </radialGradient>
          <radialGradient id="glow-orange" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.8"/>
            <stop offset="40%" stopColor="#f97316" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.0"/>
          </radialGradient>
          <radialGradient id="glow-green" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.7"/>
            <stop offset="50%" stopColor="#22c55e" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0"/>
          </radialGradient>
        </defs>
      </svg>
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
              pathOptions={{ fillColor: getColorId(zone.baseRisk), fillOpacity: 1, color: 'transparent' }}
              radius={2000 + (zone.baseRisk * 15)}
            >
              <Popup>
                <strong>{zone.name}</strong><br />
                Risk Level: {zone.baseRisk.toFixed(1)}%
              </Popup>
            </Circle>
          ))}
          <AnimatedRadar />
        </MapContainer>
      </div>
    </motion.div>
  );
}
