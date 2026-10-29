import React, { useState, useEffect } from 'react';
import { useMunicipality } from '../context/MunicipalityContext';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/api/complaintService';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import TelemetryPulse from '../components/common/TelemetryPulse';
import CityOperationsGraphic from '../components/graphics/CityOperationsGraphic';
import AiScanningWidget from '../components/graphics/AiScanningWidget';
import CivicFlowGraphic from '../components/graphics/CivicFlowGraphic';
import {
  AlertOctagon,
  ShieldAlert,
  Clock,
  ClipboardList,
  CheckCircle2,
  MapPin,
  Cpu,
  ArrowRight,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommandCenterPage() {
  const { activeMunicipality } = useMunicipality();
  const { apiUnavailable } = useAuth();
  const navigate = useNavigate();

  const [realComplaints, setRealComplaints] = useState([]);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [aiQueue, setAiQueue] = useState([
    {
      id: 'NGS-2026-000142',
      issue: 'Water Pipeline Burst & Contamination',
      category: 'Water Supply',
      ward: 'Ward 12 (Shivajinagar)',
      dept: 'Water Supply',
      priority: 'P1',
      severity: 'CRITICAL',
      slaHours: 4,
      confidence: 98,
      status: 'AWAITING_APPROVAL',
    },
    {
      id: 'NGS-2026-000141',
      issue: 'Deep Asphalt Pothole Cavity on Main Arterial Road',
      category: 'Road Damage',
      ward: 'Ward 18 (Kothrud)',
      dept: 'Road Maintenance',
      priority: 'P2',
      severity: 'HIGH',
      slaHours: 24,
      confidence: 94,
      status: 'AWAITING_APPROVAL',
    },
    {
      id: 'NGS-2026-000140',
      issue: 'Fallen Banyan Tree Branch Blocking Transit Lane',
      category: 'Tree Hazard',
      ward: 'Ward 24 (Aundh)',
      dept: 'Road Maintenance',
      priority: 'P2',
      severity: 'HIGH',
      slaHours: 12,
      confidence: 91,
      status: 'AWAITING_APPROVAL',
    },
    {
      id: 'NGS-2026-000139',
      issue: 'Solid Waste Overflow near Hadapsar Commercial Hub',
      category: 'Garbage Accumulation',
      ward: 'Ward 31 (Hadapsar)',
      dept: 'Sanitation',
      priority: 'P3',
      severity: 'MEDIUM',
      slaHours: 24,
      confidence: 93,
      status: 'AWAITING_APPROVAL',
    },
  ]);

  useEffect(() => {
    complaintService
      .getComplaints({ limit: 10 })
      .then((res) => {
        if (res.data?.items) {
          setRealComplaints(res.data.items);
          setIsApiConnected(true);
        }
      })
      .catch(() => {
        setIsApiConnected(false);
      });
  }, [activeMunicipality.id]);

  const handleApprove = (id) => {
    setAiQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const queueToDisplay = isApiConnected && realComplaints.length > 0
    ? realComplaints.map((c) => ({
        id: c.complaintId,
        issue: c.title,
        category: c.category,
        ward: c.wardId?.name || 'Ward 12',
        dept: c.departmentId?.name || 'Roads',
        priority: c.priority,
        severity: c.severity,
        slaHours: c.sla?.targetHours || 24,
        confidence: c.aiAnalysis?.confidence || 94,
        status: c.status,
      }))
    : aiQueue;

  return (
    <div className="space-y-6">
      {/* API Unavailable Banner */}
      {apiUnavailable && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>GOVERNANCE API UNAVAILABLE — Unable to connect to NagarSetu REST API backend (MongoDB offline).</span>
          </div>
          <span className="text-[10px] bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/40 font-bold">503 SERVICE UNAVAILABLE</span>
        </div>
      )}

      {/* Header Operational Status Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
              NAGARSETU CONTROL CENTER
            </span>
            <span className="text-[10px] font-mono text-slate-500">[{activeMunicipality.code}]</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">{activeMunicipality.name} Operations Hub</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{activeMunicipality.tagline}</p>
        </div>

        <div className="flex items-center gap-3">
          <TelemetryPulse status={apiUnavailable ? 'warning' : 'operational'} label={apiUnavailable ? 'API DISCONNECTED' : 'SYSTEM OPERATIONAL'} />
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800">
            DEMO ENVIRONMENT • SYNTHETIC DATA
          </span>
        </div>
      </div>

      {/* Hero Operations Topology Graphic */}
      <CityOperationsGraphic />

      {/* Key Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Active Complaints"
          value={isApiConnected ? realComplaints.length : activeMunicipality.activeComplaintsCount}
          trend="+5 today"
          accentColor="amber"
          icon={AlertOctagon}
          subtitle="Real-time citizen reports"
        />
        <StatCard
          title="Critical Incidents"
          value={activeMunicipality.criticalCount}
          trend="Immediate SLA"
          accentColor="critical"
          icon={ShieldAlert}
          subtitle="P1 emergency hazards"
        />
        <StatCard
          title="SLA At Risk"
          value={activeMunicipality.slaRiskCount}
          trend="Due < 4 hours"
          accentColor="amber"
          icon={Clock}
          subtitle="Escalation monitoring"
        />
        <StatCard
          title="Active Work Orders"
          value="38"
          trend="14 in progress"
          accentColor="blue"
          icon={ClipboardList}
          subtitle="Field worker tasks"
        />
        <StatCard
          title="Resolution Rate"
          value={activeMunicipality.resolutionRate}
          trend="+1.4% this week"
          accentColor="emerald"
          icon={CheckCircle2}
          subtitle="Citizen verified"
        />
      </div>

      {/* Closed-Loop Governance Flow Graphic */}
      <CivicFlowGraphic />

      {/* AI Routing Queue & AI Intelligence Scan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Routing Queue (2 Columns wide) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Triage Routing Queue</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  {queueToDisplay.length} PENDING APPROVAL
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/complaints')} icon={ArrowRight}>
                View All Queue
              </Button>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">
                    <th className="py-2 px-3">Complaint ID</th>
                    <th className="py-2 px-3">Issue Title</th>
                    <th className="py-2 px-3">Ward</th>
                    <th className="py-2 px-3">Priority</th>
                    <th className="py-2 px-3">AI Confidence</th>
                    <th className="py-2 px-3 text-right">Controller Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {queueToDisplay.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-amber-600 dark:text-amber-400 font-semibold">{item.id}</td>
                      <td className="py-2.5 px-3 text-slate-900 dark:text-slate-200 max-w-xs truncate">{item.issue}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{item.ward}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant={item.priority === 'P1' ? 'p1' : 'p2'}>{item.priority}</Badge>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-600 dark:text-emerald-400">{item.confidence}%</td>
                      <td className="py-2.5 px-3 text-right">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(item.id)}
                          icon={Check}
                        >
                          Approve Route
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: AI Scan Widget & Live GIS Map Thumbnail */}
        <div className="space-y-4">
          <AiScanningWidget
            isScanning={true}
            metrics={{ confidence: '94.2%', routed: '98.6%' }}
          />

          {/* GIS Map Thumbnail Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider font-mono">Live GIS Map Frame</h4>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/map')}>
                Full Map
              </Button>
            </div>

            <div className="h-44 rounded-lg bg-slate-900 border border-slate-800 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="text-center p-4 z-10">
                <MapPin className="w-8 h-8 text-amber-400 mx-auto animate-bounce mb-1" />
                <p className="text-xs font-semibold text-slate-200">{activeMunicipality.name} GIS Mesh</p>
                <span className="text-[10px] font-mono text-slate-400">
                  {activeMunicipality.wards.length} Wards • {activeMunicipality.activeComplaintsCount} Active Markers
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
