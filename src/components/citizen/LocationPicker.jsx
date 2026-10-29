import React, { useState } from 'react';
import { useMunicipality } from '../../context/MunicipalityContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass, AlertCircle, ShieldCheck } from 'lucide-react';

const customMarkerIcon = L.divIcon({
  className: 'custom-leaflet-marker-picker',
  html: `<div style="background-color: #F59E0B; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #0B1120; box-shadow: 0 0 14px #F59E0B;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function LocationMarker({ position, onPositionChange }) {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? (
    <Marker
      position={position}
      icon={customMarkerIcon}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const pos = marker.getLatLng();
          onPositionChange([pos.lat, pos.lng]);
        },
      }}
    />
  ) : null;
}

export default function LocationPicker({ location, onChange, detectedWard }) {
  const { activeMunicipality } = useMunicipality();

  const currentLat = location.coordinates[1] || activeMunicipality.centerCoordinates[0];
  const currentLng = location.coordinates[0] || activeMunicipality.centerCoordinates[1];
  const [mapPosition, setMapPosition] = useState([currentLat, currentLng]);

  const handlePositionChange = (newPos) => {
    setMapPosition(newPos);
    onChange({
      ...location,
      coordinates: [newPos[1], newPos[0]], // [lng, lat]
    });
  };

  const handleUseCurrentGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          handlePositionChange([lat, lng]);
        },
        () => {
          // Fallback to municipality default center
          handlePositionChange(activeMunicipality.centerCoordinates);
        }
      );
    } else {
      handlePositionChange(activeMunicipality.centerCoordinates);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-slate-200">Select Issue Location</h4>
          <p className="text-xs text-slate-400 mt-0.5">Click or drag the marker to pin the exact geographic site.</p>
        </div>
        <button
          type="button"
          onClick={handleUseCurrentGps}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-mono font-semibold transition-all self-start"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Use Current GPS Location</span>
        </button>
      </div>

      {/* Spatial Leaflet Picker Map Frame */}
      <div className="h-64 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 overflow-hidden relative shadow-md">
        <MapContainer
          center={mapPosition}
          zoom={14}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={mapPosition} onPositionChange={handlePositionChange} />
        </MapContainer>
      </div>

      {/* Address & Ward Intelligence Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 p-3.5 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm transition-colors">
          <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">Detailed Street Address / Landmark</label>
          <input
            type="text"
            value={location.address}
            onChange={(e) => onChange({ ...location, address: e.target.value })}
            placeholder="e.g. Near Guru Talkies, Station Road, Janata Chowk, Ichalkaranji"
            className="w-full bg-slate-50 dark:bg-brand-deepCharcoal border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-200 outline-none focus:border-amber-500 placeholder:text-slate-400"
            required
          />
          <span className="text-[10px] font-mono text-slate-500">
            Coordinates: [{location.coordinates[1].toFixed(5)}, {location.coordinates[0].toFixed(5)}]
          </span>
        </div>

        {/* Location Intelligence Panel */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-brand-charcoal border border-amber-500/30 space-y-2 shadow-sm transition-colors">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> LOCATION INTELLIGENCE
          </span>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono">Detected Ward</span>
            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">{detectedWard?.wardName || 'Prabhag 4'}</h5>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Confidence: {Math.round((detectedWard?.confidence || 0.95) * 100)}%</span>
          </div>
          <p className="text-[9px] text-slate-500 leading-tight italic">
            Demo location intelligence — municipal GIS integration can be connected in production.
          </p>
        </div>
      </div>
    </div>
  );
}
