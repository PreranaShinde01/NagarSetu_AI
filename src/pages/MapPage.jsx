import React, { useState, useEffect } from 'react';
import { useMunicipality } from '../context/MunicipalityContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Filter,
  Layers,
  AlertOctagon,
  CheckCircle2,
  Users,
  Clock,
  ShieldAlert,
  ArrowRight,
  Eye,
} from 'lucide-react';

import { complaintService } from '../services/api/complaintService';

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Leaflet SVG Colored Pin Icon Generator
const createCustomIcon = (color, label = '') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #0B1120; box-shadow: 0 0 12px ${color}; display: flex; items-center; justify-content: center; color: white; font-size: 8px; font-weight: bold;">${label}</div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};

// Helper Component to Recenter Map when Municipality changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapPage() {
  const navigate = useNavigate();
  const { activeMunicipality } = useMunicipality();
  const { isDark } = useTheme();
  const { isMarathi, t } = useLanguage();

  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [showWorkers, setShowWorkers] = useState(true);
  const [showWards, setShowWards] = useState(true);
  const [apiComplaints, setApiComplaints] = useState([]);

  // Center coordinates: Ichalkaranji default [16.6992, 74.4578]
  const baseLat = activeMunicipality.centerCoordinates?.[0] || 16.6992;
  const baseLng = activeMunicipality.centerCoordinates?.[1] || 74.4578;

  useEffect(() => {
    const muniId = activeMunicipality._id || activeMunicipality.id;
    complaintService
      .getComplaints({ municipalityId: muniId, limit: 100 })
      .then((res) => {
        if (res.data?.items && res.data.items.length > 0) {
          setApiComplaints(res.data.items);
        } else {
          setApiComplaints([]);
        }
      })
      .catch(() => setApiComplaints([]));
  }, [activeMunicipality.id, activeMunicipality._id]);

  // Synthetic Fallback Markers for the active municipality
  const syntheticMarkers = [
    {
      id: 'NGS-2026-000142',
      title: isMarathi ? 'पंचगंगा मुख्य जलवाहिनी गळती' : 'Water Main Burst & Road Flooding',
      category: isMarathi ? 'पाणी पुरवठा' : 'Water Supply',
      priority: 'P1',
      lat: baseLat + 0.005,
      lng: baseLng - 0.004,
      color: '#EF4444',
      ward: (isMarathi ? activeMunicipality.wards?.[0]?.marathiName : activeMunicipality.wards?.[0]?.name) || 'Prabhag 1',
      slaRemaining: '01h 14m',
    },
    {
      id: 'NGS-2026-000141',
      title: isMarathi ? 'जनता चौक डांबरी रस्ता खड्डे' : 'Deep Asphalt Pothole Cavity',
      category: isMarathi ? 'रस्ते दुरुस्ती' : 'Road Damage',
      priority: 'P2',
      lat: baseLat - 0.003,
      lng: baseLng + 0.005,
      color: '#F59E0B',
      ward: (isMarathi ? activeMunicipality.wards?.[1]?.marathiName : activeMunicipality.wards?.[1]?.name) || 'Prabhag 2',
      slaRemaining: '08h 42m',
    },
    {
      id: 'NGS-2026-000140',
      title: isMarathi ? 'यंत्रमाग वसाहत सांडपाणी अडथळा' : 'Powerloom Estate Drainage Blockage',
      category: isMarathi ? 'पाणी निचरा' : 'Drainage Overflow',
      priority: 'P2',
      lat: baseLat + 0.008,
      lng: baseLng + 0.009,
      color: '#F59E0B',
      ward: (isMarathi ? activeMunicipality.wards?.[4]?.marathiName : activeMunicipality.wards?.[4]?.name) || 'Prabhag 5',
      slaRemaining: '11h 20m',
    },
    {
      id: 'NGS-2026-000139',
      title: isMarathi ? 'कबनूर रस्ता कचरा कुंडी ओव्हरफ्लो' : 'Solid Waste Bin Overflow',
      category: isMarathi ? 'घनकचरा' : 'Sanitation',
      priority: 'P3',
      lat: baseLat - 0.006,
      lng: baseLng - 0.007,
      color: '#3B82F6',
      ward: (isMarathi ? activeMunicipality.wards?.[6]?.marathiName : activeMunicipality.wards?.[6]?.name) || 'Prabhag 7',
      slaRemaining: '22h 10m',
    },
  ];

  // Map API complaints to marker list
  const loadedMarkers = apiComplaints.length > 0
    ? apiComplaints
        .filter(c => c.location && Array.isArray(c.location.coordinates) && c.location.coordinates.length === 2)
        .map(c => ({
          id: c.complaintId || c._id,
          title: c.title,
          category: c.category,
          priority: c.priority || 'P2',
          lat: c.location.coordinates[1],
          lng: c.location.coordinates[0],
          color: c.priority === 'P1' ? '#EF4444' : c.priority === 'P2' ? '#F59E0B' : '#3B82F6',
          ward: c.wardId?.name || 'Assigned Ward',
          slaRemaining: '24h 00m',
        }))
    : syntheticMarkers;

  // Active Field Workers Markers
  const workerMarkers = [
    { id: 'WRK-01', name: isMarathi ? 'अमित जाधव (पथक ब)' : 'Amit Jadhav (Team B)', lat: baseLat - 0.003, lng: baseLng + 0.004, task: isMarathi ? 'खड्डा दुरुस्ती' : 'Pothole Repair' },
    { id: 'WRK-02', name: isMarathi ? 'संतोष पवार (पथक अ)' : 'Santosh Pawar (Team A)', lat: baseLat + 0.004, lng: baseLng - 0.003, task: isMarathi ? 'पाईप गळती दुरुस्ती' : 'Pipe Leakage Repair' },
  ];

  const filteredMarkers = loadedMarkers.filter((m) => {
    return selectedPriority === 'ALL' || m.priority === selectedPriority;
  });

  return (
    <div className="space-y-4 h-[calc(100vh-6.5rem)] flex flex-col">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-xl shrink-0 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20 font-bold">
              {isMarathi ? 'स्मार्ट शहर जीआयएस नकाशा' : 'SMART CITY GIS SPATIAL MESH'}
            </span>
            <span className="text-[10px] font-mono text-slate-500">[{activeMunicipality.code}]</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-sans">
            {isMarathi ? (activeMunicipality.marathiName || activeMunicipality.name) : activeMunicipality.name}{' '}
            <span className="text-amber-600 dark:text-amber-400 font-extrabold">
              {isMarathi ? 'थेट नागरी नकाशा' : 'Interactive GIS Operations Map'}
            </span>
          </h1>
        </div>

        {/* Map Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 font-mono">
            <Filter className="w-3.5 h-3.5 text-amber-500 font-bold" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent text-amber-600 dark:text-amber-400 font-bold outline-none cursor-pointer"
            >
              <option value="ALL">{isMarathi ? 'सर्व अग्रक्रम' : 'All Priorities'}</option>
              <option value="P1">{isMarathi ? 'P1 तातडीची' : 'P1 Critical Only'}</option>
              <option value="P2">{isMarathi ? 'P2 उच्च' : 'P2 High Only'}</option>
              <option value="P3">{isMarathi ? 'P3 मध्यम' : 'P3 Medium Only'}</option>
            </select>
          </div>

          <button
            onClick={() => setShowWorkers(!showWorkers)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              showWorkers
                ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-500 border-slate-300 dark:border-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> {isMarathi ? 'क्षेत्रीय कर्मचारी' : 'Field Workers'} ({showWorkers ? 'ON' : 'OFF'})
          </button>

          <button
            onClick={() => setShowWards(!showWards)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              showWards
                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-500 border-slate-300 dark:border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> {isMarathi ? 'प्रभाग सीमा' : 'Ward Rings'} ({showWards ? 'ON' : 'OFF'})
          </button>
        </div>
      </div>

      {/* GIS Map Frame */}
      <div className="flex-1 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 overflow-hidden relative shadow-2xl z-10 transition-colors duration-200">
        {/* Floating Overlay Info */}
        <div className="absolute top-3 left-3 z-[1000] bg-white/90 dark:bg-brand-deepCharcoal/90 border border-amber-500/40 px-3 py-1.5 rounded-xl text-[10px] font-mono text-amber-600 dark:text-amber-400 backdrop-blur-md shadow-lg font-bold">
          ● REAL-TIME MUNICIPAL GIS FEED: {filteredMarkers.length} INCIDENTS LOADED
        </div>

        <MapContainer
          key={activeMunicipality.id}
          center={activeMunicipality.centerCoordinates}
          zoom={activeMunicipality.zoomLevel}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
          className="z-0"
        >
          <ChangeView center={activeMunicipality.centerCoordinates} zoom={activeMunicipality.zoomLevel} />

          {/* Theme-aware Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={
              isDark
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            }
          />

          {/* Ward Rings Overlay */}
          {showWards &&
            activeMunicipality.wards?.map((w, idx) => (
              <Circle
                key={w.id || idx}
                center={
                  w.coords || [
                    baseLat + (idx === 0 ? 0.005 : idx === 1 ? -0.005 : idx === 2 ? 0.01 : -0.01),
                    baseLng + (idx === 0 ? -0.005 : idx === 1 ? 0.005 : idx === 2 ? 0.01 : -0.01),
                  ]
                }
                radius={900}
                pathOptions={{
                  color: isDark ? '#f59e0b' : '#d97706',
                  fillColor: isDark ? '#f59e0b' : '#d97706',
                  fillOpacity: 0.08,
                  weight: 1.5,
                  dashArray: '4 4',
                }}
              >
                <Popup>
                  <div className="p-1 text-xs font-sans">
                    <strong className="text-amber-500 font-bold block">
                      {isMarathi ? (w.marathiName || w.name) : w.name}
                    </strong>
                    {w.officer && <div className="text-[10px] text-slate-500">{w.officer}</div>}
                    {w.population && <div className="text-[10px] text-slate-600 font-mono">लोकसंख्या: {w.population.toLocaleString('en-IN')}</div>}
                  </div>
                </Popup>
              </Circle>
            ))}

          {/* Incident Pins */}
          {filteredMarkers.map((marker) => (
            <React.Fragment key={marker.id}>
              <Circle
                center={[marker.lat, marker.lng]}
                radius={250}
                pathOptions={{
                  color: marker.color,
                  fillColor: marker.color,
                  fillOpacity: 0.2,
                  weight: 1,
                }}
              />
              <Marker position={[marker.lat, marker.lng]} icon={createCustomIcon(marker.color)}>
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 space-y-1.5 font-sans">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">{marker.id}</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300">
                        {marker.priority}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{marker.title}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">{marker.ward}</p>

                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 pt-1 border-t border-slate-200 dark:border-slate-800">
                      <Clock className="w-3 h-3 text-amber-500" /> SLA: {marker.slaRemaining} remaining
                    </div>

                    <div className="pt-1 flex items-center justify-end">
                      <button
                        onClick={() => navigate(`/citizen/complaint/${marker.id}`)}
                        className="px-2.5 py-1 bg-amber-500 text-slate-950 hover:bg-amber-400 text-[10px] font-extrabold rounded-lg font-mono flex items-center gap-1 shadow-sm"
                      >
                        Inspect Ticket <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

          {/* Active Field Workers Pins */}
          {showWorkers &&
            workerMarkers.map((w) => (
              <Marker key={w.id} position={[w.lat, w.lng]} icon={createCustomIcon('#06B6D4', 'W')}>
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 font-sans space-y-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase">FIELD WORKER ACTIVE</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{w.name}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">Assigned: {w.task}</p>
                    <button
                      onClick={() => navigate('/worker/dashboard')}
                      className="mt-1.5 px-2 py-1 bg-cyan-600 text-white text-[10px] font-bold rounded font-mono w-full"
                    >
                      Open Field Control Panel
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}
