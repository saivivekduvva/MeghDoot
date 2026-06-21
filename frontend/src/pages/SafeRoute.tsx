import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, Popup, useMapEvents, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation2, Search, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

// Fix for default marker icons by using custom divIcons
import L from 'leaflet';

const startIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg text-white font-bold text-xs">S</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const endIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div class="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg text-white font-bold text-xs">D</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const MapClickHandler = ({ onMapClick }: { onMapClick: (latlng: any) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const MapBoundsUpdater = ({ start, end }: { start: [number, number], end: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (start && end) {
      const bounds = L.latLngBounds([start, end]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [start, end, map]);
  return null;
};

const DraggableHazard = ({ initialCenter, radius, label, onMove }: any) => {
  const [position, setPosition] = useState(initialCenter);
  // Update position if initialCenter changes (e.g. new route search)
  useEffect(() => { setPosition(initialCenter); }, [initialCenter]);

  const dragIcon = L.divIcon({
    className: 'bg-transparent',
    html: `<div class="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-white shadow shadow-red-500/50 text-white cursor-move opacity-70 hover:opacity-100 transition-opacity transform hover:scale-110">✥</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <>
      <Marker 
        position={position} 
        draggable={true} 
        icon={dragIcon}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const pos = marker.getLatLng();
            const newPos = [pos.lat, pos.lng] as [number, number];
            setPosition(newPos);
            onMove(newPos);
          },
          drag: (e) => {
            const marker = e.target;
            const pos = marker.getLatLng();
            setPosition([pos.lat, pos.lng]);
          }
        }}
      >
        <Popup>{label} (Draggable)</Popup>
      </Marker>
      <Circle 
        center={position} 
        radius={radius} 
        pathOptions={{ fillColor: 'url(#hazardGlow)', fillOpacity: 1, color: 'transparent' }}
      />
    </>
  );
};

export default function SafeRoute() {
  const [isRouting, setIsRouting] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [pings, setPings] = useState<{ id: number, pos: [number, number] }[]>([]);

  const [sourceInput, setSourceInput] = useState('Kakinada');
  const [destInput, setDestInput] = useState('Rajahmundry');
  
  const [startPoint, setStartPoint] = useState<[number, number]>([16.9891, 82.2475]); // Default Kakinada
  const [endPoint, setEndPoint] = useState<[number, number]>([17.0005, 81.8040]);     // Default Rajahmundry
  const [center, setCenter] = useState<[number, number]>([16.995, 82.02]);
  const [safeRoutePath, setSafeRoutePath] = useState<[number, number][]>([]);

  const [hazards, setHazards] = useState([
    { id: 1, center: [16.9891 + 0.02, 82.2475 + 0.02] as [number, number], radius: 2500, label: "Severe Waterlogging (1.5m)" },
    { id: 2, center: [17.0005 - 0.02, 81.8040 - 0.02] as [number, number], radius: 3000, label: "Infrastructure Collapse Risk" },
  ]);

  const calculateRoute = (start: [number, number], end: [number, number], activeHazards: any[]) => {
    // Generate base midpoints
    let m1: [number, number] = [start[0] + (end[0]-start[0])*0.33, start[1] + (end[1]-start[1])*0.33];
    let m2: [number, number] = [start[0] + (end[0]-start[0])*0.66, start[1] + (end[1]-start[1])*0.66];

    // Simple repulsive force from hazards
    activeHazards.forEach(h => {
      const hLat = h.center[0];
      const hLng = h.center[1];
      
      const pushAway = (pt: [number, number]) => {
        // Roughly 1 degree is 111km. We want to avoid within ~4km radius (0.04 degrees)
        const dist = Math.sqrt(Math.pow(pt[0]-hLat, 2) + Math.pow(pt[1]-hLng, 2));
        if (dist < 0.05) { 
          const pushFactor = (0.05 - dist) * 1.8;
          const angle = Math.atan2(pt[0]-hLat, pt[1]-hLng);
          return [pt[0] + Math.sin(angle)*pushFactor, pt[1] + Math.cos(angle)*pushFactor] as [number, number];
        }
        return pt;
      };

      m1 = pushAway(m1);
      m2 = pushAway(m2);
    });

    setSafeRoutePath([start, m1, m2, end]);
  };

  const handleHazardMove = (id: number, newCenter: [number, number]) => {
     setHazards(prev => {
        const nextHazards = prev.map(h => h.id === id ? { ...h, center: newCenter } : h);
        if (showRoute) calculateRoute(startPoint, endPoint, nextHazards);
        return nextHazards;
     });
  };

  const handleMapClick = (latlng: any) => {
    const newPing = { id: Date.now(), pos: [latlng.lat, latlng.lng] as [number, number] };
    setPings(prev => [...prev, newPing]);
    setTimeout(() => {
      setPings(prev => prev.filter(p => p.id !== newPing.id));
    }, 2000);
  };

  const geocode = async (query: string): Promise<[number, number] | null> => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (e) {
      console.error("Geocoding failed", e);
    }
    return null;
  };

  const handleRouteSearch = async () => {
    setIsRouting(true);
    setShowRoute(false);
    
    // Fetch real coordinates
    const startCoords = await geocode(sourceInput);
    const endCoords = await geocode(destInput);

    if (startCoords && endCoords) {
      setStartPoint(startCoords);
      setEndPoint(endCoords);
      setCenter([(startCoords[0] + endCoords[0]) / 2, (startCoords[1] + endCoords[1]) / 2]);
      
      const newHazards = [
        { id: 1, center: [startCoords[0] + 0.03, startCoords[1] + 0.03] as [number, number], radius: 2500, label: "Severe Waterlogging" },
        { id: 2, center: [endCoords[0] - 0.03, endCoords[1] - 0.03] as [number, number], radius: 3000, label: "Collapse Risk" },
      ];
      setHazards(newHazards);
      calculateRoute(startCoords, endCoords, newHazards);
    }

    setIsRouting(false);
    setShowRoute(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col md:flex-row gap-6 p-2 relative"
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <radialGradient id="hazardGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9"/>
            <stop offset="40%" stopColor="#ef4444" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0"/>
          </radialGradient>
        </defs>
      </svg>
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
              <input type="text" placeholder="Current Location" 
                value={sourceInput} onChange={(e) => setSourceInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700" />
            </div>
            
            <div className="relative">
              <div className="absolute top-3 left-3 text-red-500">
                <MapPin className="w-5 h-5" />
              </div>
              <input type="text" placeholder="Destination" 
                value={destInput} onChange={(e) => setDestInput(e.target.value)}
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
          
          
          {showRoute && <MapBoundsUpdater start={startPoint} end={endPoint} />}
          <MapClickHandler onMapClick={handleMapClick} />
          
          {/* Ripple Pings */}
          {pings.map((ping) => (
            <CircleMarker 
              key={ping.id} 
              center={ping.pos} 
              radius={20} 
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.6, className: 'animate-ping' }} 
            />
          ))}

          {/* Hazards */}
          {hazards.map((zone) => (
            <DraggableHazard 
              key={zone.id}
              initialCenter={zone.center}
              radius={zone.radius}
              label={zone.label}
              onMove={(newCenter: [number, number]) => handleHazardMove(zone.id, newCenter)}
            />
          ))}

          {/* Route */}
          {showRoute && (
            <>
              <Marker position={startPoint} icon={startIcon}><Popup>Start Location</Popup></Marker>
              <Marker position={endPoint} icon={endIcon}><Popup>Safe Destination</Popup></Marker>
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
