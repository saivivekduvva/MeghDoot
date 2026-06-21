import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation2, Search, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

// Fix for default marker icons in react-leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function SafeRoute() {
  const [isRouting, setIsRouting] = useState(false);
  const [showRoute, setShowRoute] = useState(false);

  const center: [number, number] = [22.5726, 88.3639]; // Example: Kolkata
  
  // Example dummy coordinates for map
  const hazardZones = [
    { center: [22.57, 88.36] as [number, number], radius: 1200, label: "Severe Waterlogging (1.5m)" },
    { center: [22.59, 88.39] as [number, number], radius: 1500, label: "Infrastructure Collapse Risk" },
  ];

  const startPoint: [number, number] = [22.55, 88.34];
  const endPoint: [number, number] = [22.61, 88.42];

  const safeRoutePath: [number, number][] = [
    startPoint,
    [22.545, 88.355],
    [22.545, 88.380],
    [22.560, 88.420],
    [22.590, 88.430],
    endPoint
  ];

  const handleRouteSearch = () => {
    setIsRouting(true);
    setShowRoute(false);
    setTimeout(() => {
      setIsRouting(false);
      setShowRoute(true);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col md:flex-row gap-6 p-2"
    >
      {/* Left Panel */}
      <div className="w-full md:w-96 flex flex-col gap-6 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Safe Route</h2>
          <p className="text-slate-500 mt-2">AI-powered navigation avoiding active disaster zones.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute top-3 left-3 text-emerald-500">
                <MapPin className="w-5 h-5" />
              </div>
              <input type="text" placeholder="Current Location" defaultValue="Central Station"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700" />
            </div>
            
            <div className="relative">
              <div className="absolute top-3 left-3 text-red-500">
                <MapPin className="w-5 h-5" />
              </div>
              <input type="text" placeholder="Destination" defaultValue="Relief Camp Sector 4"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700" />
            </div>

            <button 
              onClick={handleRouteSearch}
              disabled={isRouting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
            >
              {isRouting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Navigation2 className="w-5 h-5" />
              )}
              {isRouting ? 'Calculating Safe Path...' : 'Find Safe Route'}
            </button>
          </div>
        </div>

        {showRoute && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm"
          >
            <h4 className="font-bold text-emerald-800 flex items-center gap-2 mb-2">
              <AlertOctagon className="w-5 h-5" />
              Route Optimized
            </h4>
            <p className="text-emerald-700 text-sm mb-3 font-medium">Successfully bypassed 2 active hazard zones.</p>
            <div className="flex justify-between items-center bg-white/60 p-3 rounded-lg border border-emerald-100">
              <span className="text-slate-600 text-sm font-semibold">Est. Travel Time</span>
              <span className="text-emerald-800 font-bold text-lg">45 mins</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right Panel (Map) */}
      <div className="flex-1 bg-slate-100 rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative min-h-[400px]">
        <MapContainer center={center} zoom={11} className="w-full h-full z-0">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Hazards */}
          {hazardZones.map((zone, idx) => (
            <Circle 
              key={idx} 
              center={zone.center} 
              radius={zone.radius} 
              pathOptions={{ color: 'red', fillColor: '#ef4444', fillOpacity: 0.25, weight: 2 }}
            >
              <Popup>{zone.label}</Popup>
            </Circle>
          ))}

          {/* Route */}
          {showRoute && (
            <>
              <Marker position={startPoint}><Popup>Start Location</Popup></Marker>
              <Marker position={endPoint}><Popup>Safe Destination</Popup></Marker>
              <Polyline 
                positions={safeRoutePath} 
                pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.9 }} 
              />
            </>
          )}
        </MapContainer>
        
        {!showRoute && !isRouting && (
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="bg-white px-6 py-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-blue-600 animate-pulse" />
              <span className="font-bold text-slate-700">Enter destination to generate a safe route</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
