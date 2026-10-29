import React, { useState, useEffect } from 'react';
import { escalationService } from '../../services/api/escalationService';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  ShieldAlert,
  ArrowUpRight,
  UserCheck,
  CheckCircle2,
  RefreshCw,
  Clock,
  ChevronRight,
  Layers,
} from 'lucide-react';

export default function ControllerEscalationsPage() {
  const navigate = useNavigate();
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEscalation, setSelectedEscalation] = useState(null);
  const [reassignTarget, setReassignTarget] = useState('');
  const [reassignNotes, setReassignNotes] = useState('');

  const fetchEscalations = async () => {
    setLoading(true);
    try {
      const res = await escalationService.getEscalations({ limit: 20 });
      if (res.data) setEscalations(res.data);
      else if (Array.isArray(res)) setEscalations(res);
    } catch (err) {
      console.warn('Escalation fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscalations();
  }, []);

  const handleReassign = async () => {
    if (!selectedEscalation) return;
    try {
      await escalationService.reassignEscalation(selectedEscalation._id, {
        targetUserId: reassignTarget || '65f01234567890abcdef0005',
        notes: reassignNotes || 'Reassigned by Controller command center.',
      });
      alert('Escalation reassigned successfully!');
      setSelectedEscalation(null);
      fetchEscalations();
    } catch (err) {
      alert('Reassignment failed: ' + (err.message || 'Error'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-sans uppercase tracking-wide">
                  Municipal Escalations Engine
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  Live DB • Ichalkaranji
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                Operational escalation matrix for SLA breaches, supervisor rejections, and repeated grievance reopenings.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchEscalations}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Telemetry Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-rose-200 dark:border-rose-500/30 shadow-sm transition-colors">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block">CRITICAL ESCALATIONS</span>
          <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono mt-1 block">11</span>
          <span className="text-[10px] text-slate-500 font-mono">Immediate Action Required</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-amber-200 dark:border-amber-500/30 shadow-sm transition-colors">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block">SLA BREACHED</span>
          <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-1 block">19</span>
          <span className="text-[10px] text-slate-500 font-mono">Overdue Threshold</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-cyan-200 dark:border-cyan-500/30 shadow-sm transition-colors">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block">REASSIGNMENT REQUIRED</span>
          <span className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono mt-1 block">6</span>
          <span className="text-[10px] text-slate-500 font-mono font-bold">Unassigned Senior Units</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-purple-200 dark:border-purple-500/30 shadow-sm transition-colors">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block">REPEATED COMPLAINTS</span>
          <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 font-mono mt-1 block">4</span>
          <span className="text-[10px] text-slate-500 font-mono">Reopened &gt; 2 Times</span>
        </div>
      </div>

      {/* Escalation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {escalations.length === 0 && !loading && (
          <div className="col-span-full p-8 text-center bg-white dark:bg-brand-charcoal rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
            No active escalations. All civic SLA metrics are on track.
          </div>
        )}
        {escalations.map((esc) => {
          const comp = esc.complaintId || {};
          return (
            <div
              key={esc._id}
              className="bg-white dark:bg-brand-charcoal p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 font-mono">{comp.complaintId || esc.escalationId}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/40">
                    LEVEL {esc.level || 2} ESCALATION
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-sans">{comp.title || 'Escalated Grievance Case'}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-1 line-clamp-2">{esc.reason}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div><span className="text-slate-500">Dept:</span> <strong className="text-slate-800 dark:text-slate-300">{esc.departmentId?.name || 'Infrastructure'}</strong></div>
                  <div><span className="text-slate-500">Ward:</span> <strong className="text-slate-800 dark:text-slate-300">{esc.wardId?.name || 'Ward Area'}</strong></div>
                  <div><span className="text-slate-500">Trigger:</span> <strong className="text-amber-600 dark:text-amber-400">{esc.trigger}</strong></div>
                  <div><span className="text-slate-500">Status:</span> <strong className="text-rose-600 dark:text-rose-400">{esc.status}</strong></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => navigate(`/citizen/complaint/${comp.complaintId || comp._id}`)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold font-mono rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-1 transition-colors"
                >
                  VIEW CASE <ArrowUpRight className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                </button>
                <button
                  onClick={() => setSelectedEscalation(esc)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold font-mono rounded-lg shadow-sm"
                >
                  REASSIGN / RESOLVE
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reassign Modal */}
      {selectedEscalation && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl transition-colors">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">Reassign Escalation: {selectedEscalation.escalationId}</h3>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 font-mono block mb-1">REASSIGNMENT INSTRUCTIONS</label>
              <textarea
                value={reassignNotes}
                onChange={(e) => setReassignNotes(e.target.value)}
                placeholder="Enter controller dispatch notes..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 rounded p-2 outline-none h-20"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setSelectedEscalation(null)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">Cancel</button>
              <button onClick={handleReassign} className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-sm">Confirm Reassignment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
