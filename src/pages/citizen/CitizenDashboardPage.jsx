import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useMunicipality } from '../../context/MunicipalityContext';
import { complaintService } from '../../services/api/complaintService';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import CitizenComplaintCard from '../../components/citizen/CitizenComplaintCard';
import TelemetryPulse from '../../components/common/TelemetryPulse';
import { PlusCircle, Search, AlertOctagon, CheckCircle2, Clock, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function CitizenDashboardPage() {
  const { currentUser, apiUnavailable } = useAuth();
  const { activeMunicipality } = useMunicipality();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fallback demo complaints for Ichalkaranji
  const demoCitizenComplaints = [
    {
      _id: '1',
      complaintId: 'NGS-2026-000143',
      title: 'Streetlight malfunction on Main Road near Janata Chowk',
      description: 'Multiple streetlights off near Janata Chowk junction creating public safety risk at night.',
      category: 'Streetlight Outage',
      ward: 'Prabhag 4 (Janata Chowk / Textile Colony, Ichalkaranji)',
      priority: 'P2',
      status: 'IN_PROGRESS',
      createdAt: new Date().toISOString(),
    },
    {
      _id: '2',
      complaintId: 'NGS-2026-000142',
      title: 'Water Pipeline Leak near Station Road',
      description: 'Clean drinking water leaking on main road from broken distribution valve.',
      category: 'Water Supply',
      ward: 'Prabhag 4 (Station Road & Vikas Nagar, Ichalkaranji)',
      priority: 'P1',
      status: 'AWAITING_VERIFICATION',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      _id: '3',
      complaintId: 'NGS-2026-000138',
      title: 'Uncollected Solid Waste Heap near Powerloom Estate',
      description: 'Garbage accumulation near commercial bin area not cleared.',
      category: 'Garbage Accumulation',
      ward: 'Prabhag 5 (Powerloom Weaving Estate, Ichalkaranji)',
      priority: 'P3',
      status: 'RESOLVED',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  useEffect(() => {
    complaintService
      .getComplaints({ page: 1, limit: 10 })
      .then((res) => {
        if (res.data?.items && res.data.items.length > 0) {
          setComplaints(res.data.items);
        } else if (Array.isArray(res.data) && res.data.length > 0) {
          setComplaints(res.data);
        } else {
          setComplaints(demoCitizenComplaints);
        }
      })
      .catch(() => {
        setComplaints(demoCitizenComplaints);
      })
      .finally(() => setIsLoading(false));
  }, [activeMunicipality.id]);

  const filtered = complaints.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.complaintId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* API Status Banner if offline */}
      {apiUnavailable && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>GOVERNANCE API UNAVAILABLE — Displaying local telemetry preview.</span>
          </div>
          <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40 font-bold">OFFLINE PREVIEW</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl relative overflow-hidden transition-colors">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 font-bold">
            CITIZEN GOVERNANCE PORTAL • ICHALKARANJI
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            Welcome, {currentUser?.name || 'Citizen'}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
            Your civic issues. Your city. Your voice.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/citizen/report')}
            icon={PlusCircle}
            className="shadow-md shadow-amber-500/20 text-slate-950 font-extrabold"
          >
            Report Civic Issue
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Total Issues" value={complaints.length} accentColor="amber" icon={AlertOctagon} />
        <StatCard title="Active" value={complaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length} accentColor="critical" icon={Clock} />
        <StatCard title="In Progress" value={complaints.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length} accentColor="blue" icon={Clock} />
        <StatCard title="Resolved" value={complaints.filter((c) => c.status === 'RESOLVED').length} accentColor="emerald" icon={CheckCircle2} />
        <StatCard title="Verification" value={complaints.filter((c) => c.status === 'AWAITING_VERIFICATION' || c.status === 'AWAITING_CITIZEN_VERIFICATION').length} accentColor="purple" icon={ShieldCheck} />
        <StatCard title="Reopened" value={complaints.filter((c) => c.status === 'REOPENED').length} accentColor="critical" icon={RotateCcw} />
      </div>

      {/* My Recent Complaints Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">My Recent Complaints</h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID or title..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-900 dark:text-slate-200 outline-none focus:border-amber-500 placeholder:text-slate-400"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 text-center space-y-3 transition-colors shadow-sm">
            <AlertOctagon className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-300">No civic complaints found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't reported any civic grievances yet for {activeMunicipality.name}.
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/citizen/report')} icon={PlusCircle}>
              Report Your First Issue
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <CitizenComplaintCard key={item._id || item.complaintId} complaint={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
