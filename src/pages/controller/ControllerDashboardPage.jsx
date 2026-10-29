import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMunicipality } from '../../context/MunicipalityContext';
import { useLanguage } from '../../context/LanguageContext';
import { analyticsService } from '../../services/api/analyticsService';
import { complaintService } from '../../services/api/complaintService';
import CityNetworkGraphic from '../../components/graphics/CityNetworkGraphic';
import CityOperationsGraphic from '../../components/graphics/CityOperationsGraphic';
import SLAHealthGraphic from '../../components/graphics/SLAHealthGraphic';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Layers,
  ArrowUpRight,
  Sparkles,
  Zap,
  MapPin,
  Filter,
  RefreshCw,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

// Leaflet marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function ControllerDashboardPage() {
  const navigate = useNavigate();
  const { activeMunicipality } = useMunicipality();
  const { isMarathi, t } = useLanguage();

  const [overview, setOverview] = useState({
    totalComplaints: 1248,
    activeComplaints: 436,
    criticalComplaints: 27,
    slaAtRisk: 63,
    overdue: 19,
    resolvedToday: 84,
    activeFieldTeams: 42,
    escalatedCount: 11,
    cityHealthScore: 87,
  });

  const [recentComplaints, setRecentComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWard, setSelectedWard] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [ovRes, compRes] = await Promise.all([
        analyticsService.getOverview({ municipalityId: activeMunicipality._id || activeMunicipality.id }),
        complaintService.getComplaints({ limit: 6, sortOrder: 'desc' }),
      ]);

      if (ovRes.data) setOverview(ovRes.data);
      if (compRes.data?.items) setRecentComplaints(compRes.data.items);
    } catch (err) {
      console.warn('Dashboard api fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeMunicipality]);

  const mapCenter = activeMunicipality?.centerCoordinates || [16.6992, 74.4578];

  // Ward markers: authentic Prabhags for Ichalkaranji
  const displayedWards = (activeMunicipality?.wards && activeMunicipality.wards.length > 0)
    ? activeMunicipality.wards.map((w, idx) => ({
        id: w.id || `ward-${idx}`,
        name: isMarathi ? (w.marathiName || w.name) : w.name,
        coords: w.coords || [16.6992, 74.4578],
        active: Math.floor((w.population || 28000) / 2500) + 3,
        critical: Math.floor(idx % 3) + 1,
        slaRisk: Math.floor(idx % 4) + 1,
        workers: Math.floor((w.population || 28000) / 3800) + 4,
      }))
    : [
        { id: 'w-imc-01', name: 'Prabhag 1: Rajwada & Kapad Market', coords: [16.6985, 74.4620], active: 14, critical: 3, slaRisk: 4, workers: 8 },
        { id: 'w-imc-04', name: 'Prabhag 4: Station Road & Vikas Nagar (HQ)', coords: [16.6992, 74.4578], active: 22, critical: 5, slaRisk: 7, workers: 12 },
        { id: 'w-imc-05', name: 'Prabhag 5: Powerloom Weaving Estate', coords: [16.7110, 74.4710], active: 11, critical: 1, slaRisk: 2, workers: 6 },
        { id: 'w-imc-06', name: 'Prabhag 6: Panchganga River Intake Well', coords: [16.6850, 74.4480], active: 19, critical: 4, slaRisk: 6, workers: 10 },
      ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-wide font-sans uppercase">
              {isMarathi ? 'नगरसेतू AI ' : 'NagarSetu AI '}
              <span className="text-amber-500 dark:text-amber-400">
                {isMarathi ? 'नियंत्रण कक्ष (कमांड सेंटर)' : 'Controller Command Center'}
              </span>
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {t('system_operational')}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2 font-mono">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {isMarathi ? (activeMunicipality?.marathiName || activeMunicipality?.name) : (activeMunicipality?.name || 'Ichalkaranji Municipal Corporation')}
            </span>
            <span>•</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">{t('demo_env')}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/controller/routing')}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            {t('btn_launch_routing')}
          </button>
          <button
            onClick={fetchDashboardData}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs transition-colors shadow-sm"
            title="Refresh Operational Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Dense Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'TOTAL COMPLAINTS', val: overview.totalComplaints, color: 'text-slate-900 dark:text-slate-100', bg: 'border-slate-200 dark:border-slate-800', indicator: '+12 today' },
          { label: 'ACTIVE', val: overview.activeComplaints, color: 'text-amber-600 dark:text-amber-400', bg: 'border-amber-500/30 bg-amber-500/5', indicator: 'Operational' },
          { label: 'CRITICAL', val: overview.criticalComplaints, color: 'text-rose-600 dark:text-rose-400', bg: 'border-rose-500/40 bg-rose-500/5', indicator: 'P1 Emergency' },
          { label: 'SLA AT RISK', val: overview.slaAtRisk, color: 'text-amber-700 dark:text-amber-300', bg: 'border-amber-400/40 bg-amber-400/5', indicator: '< 2h Remaining' },
          { label: 'OVERDUE', val: overview.overdue, color: 'text-red-600 dark:text-red-400', bg: 'border-red-500/40 bg-red-500/5', indicator: 'Escalated' },
          { label: 'RESOLVED TODAY', val: overview.resolvedToday, color: 'text-emerald-600 dark:text-emerald-400', bg: 'border-emerald-500/30 bg-emerald-500/5', indicator: 'Verified' },
          { label: 'FIELD TEAMS ACTIVE', val: overview.activeFieldTeams, color: 'text-cyan-600 dark:text-cyan-400', bg: 'border-cyan-500/30 bg-cyan-500/5', indicator: 'Units On Site' },
          { label: 'ESCALATED', val: overview.escalatedCount, color: 'text-purple-600 dark:text-purple-400', bg: 'border-purple-500/30 bg-purple-500/5', indicator: 'Level 2+' },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -2, scale: 1.02 }}
            className={`p-3 rounded-xl bg-white dark:bg-brand-charcoal border ${card.bg} shadow-sm dark:shadow-md flex flex-col justify-between select-none relative overflow-hidden transition-colors`}
          >
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{card.label}</span>
            <div className="mt-2 mb-1 flex items-baseline justify-between">
              <span className={`text-xl font-extrabold font-mono ${card.color}`}>{card.val.toLocaleString()}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            </div>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono truncate">{card.indicator}</span>
          </motion.div>
        ))}
      </div>

      {/* Main Grid Section: Live Map & Analytics/Graphics Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live City Operations Map (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-brand-charcoal p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-200 font-sans uppercase">Live City Operations Map</h2>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> P1 Critical</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> P2 High</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> P3 Medium</span>
            </div>
          </div>

          <div className="h-[420px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative z-10">
            <MapContainer center={mapCenter} zoom={12} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {displayedWards.map((w) => (
                <React.Fragment key={w.id}>
                  <Marker position={w.coords}>
                    <Popup>
                      <div className="p-1 font-sans text-xs space-y-1">
                        <strong className="text-slate-900 font-bold block">{w.name}</strong>
                        <div className="text-[11px] text-slate-700">
                          <div>Active: <strong>{w.active}</strong></div>
                          <div>Critical: <strong className="text-rose-600">{w.critical}</strong></div>
                          <div>SLA Risk: <strong className="text-amber-600">{w.slaRisk}</strong></div>
                          <div>Workers: <strong>{w.workers} Active</strong></div>
                        </div>
                        <button
                          onClick={() => setSelectedWard(w)}
                          className="mt-1 w-full bg-slate-900 text-amber-400 text-[10px] font-bold py-1 rounded"
                        >
                          Inspect Ward Details
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                  <Circle center={w.coords} radius={1200} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.1 }} />
                </React.Fragment>
              ))}
            </MapContainer>

            {/* Floating Ward Overlay */}
            {selectedWard && (
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 dark:bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-amber-500/40 z-[1000] flex items-center justify-between text-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-amber-400 font-mono">{selectedWard.name}</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 font-mono">
                    Active: {selectedWard.active} | Critical: {selectedWard.critical} | SLA Risk: {selectedWard.slaRisk} | Field Teams: {selectedWard.workers}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/ward/dashboard')}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg"
                  >
                    Open Ward Operations
                  </button>
                  <button onClick={() => setSelectedWard(null)} className="text-xs text-slate-400 hover:text-slate-200 px-2">✕</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Operational Graphics & Health Gauge (1 Col) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-brand-charcoal p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-mono">Municipal SLA & City Health Index</h3>
            <div className="flex items-center justify-around py-2">
              <SLAHealthGraphic score={overview.cityHealthScore} className="w-28 h-28" />
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">SLA COMPLIANCE</span>
                  <span className="text-amber-600 dark:text-amber-400 font-extrabold text-base">91.4%</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">AVG RESOLUTION</span>
                  <span className="text-slate-900 dark:text-slate-200 font-extrabold">7h 42m</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-brand-charcoal p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3 transition-colors">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-mono">Operational Workflow Hierarchy</h3>
            <CityNetworkGraphic className="h-36" />
          </div>

          <div className="bg-white dark:bg-brand-charcoal p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3 transition-colors">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-mono">Civic Infrastructure Grid</h3>
            <CityOperationsGraphic className="h-36" />
          </div>
        </div>
      </div>

      {/* Recent Operational Complaints Table */}
      <div className="bg-white dark:bg-brand-charcoal p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-200 font-sans uppercase">Active Complaints Queue Overview</h2>
          <button
            onClick={() => navigate('/controller/complaints')}
            className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-500 font-mono font-bold flex items-center gap-1"
          >
            View Full Queue <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">COMPLAINT ID</th>
                <th className="p-3">TITLE / CATEGORY</th>
                <th className="p-3">WARD</th>
                <th className="p-3">PRIORITY</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {recentComplaints.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-amber-600 dark:text-amber-400 font-bold">{item.complaintId}</td>
                  <td className="p-3">
                    <div className="font-sans font-semibold text-slate-900 dark:text-slate-200">{item.title}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.category}</div>
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{item.wardId?.name || 'Ward Area'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      item.priority === 'P1' ? 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-500/40' : 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-500/40'
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/citizen/complaint/${item.complaintId}`)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold rounded flex items-center gap-1 border border-slate-300 dark:border-slate-700 transition-colors"
                    >
                      <Eye className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Case File
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
