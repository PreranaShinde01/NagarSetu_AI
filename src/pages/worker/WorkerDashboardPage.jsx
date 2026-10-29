import React, { useState, useEffect } from 'react';
import { workOrderService } from '../../services/api/workOrderService';
import { useAuth } from '../../context/AuthContext';
import ResolutionEvidenceUploader from '../../components/operations/ResolutionEvidenceUploader';
import { HardHat, MapPin, Clock, CheckCircle2, Play, Navigation, AlertTriangle, RefreshCw } from 'lucide-react';

export default function WorkerDashboardPage() {
  const { currentUser } = useAuth();
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCompletingWO, setActiveCompletingWO] = useState(null);

  const fetchWorkerOrders = async () => {
    setLoading(true);
    try {
      const res = await workOrderService.getWorkOrders({ limit: 10 });
      if (res.data) setWorkOrders(res.data);
      else if (Array.isArray(res)) setWorkOrders(res);
    } catch (err) {
      console.warn('Worker orders fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerOrders();
  }, []);

  const handleAccept = async (id) => {
    try {
      await workOrderService.acceptWorkOrder(id);
      fetchWorkerOrders();
    } catch (err) {
      alert('Failed to accept work order.');
    }
  };

  const handleStart = async (id) => {
    try {
      await workOrderService.startWorkOrder(id);
      fetchWorkerOrders();
    } catch (err) {
      alert('Failed to start work order.');
    }
  };

  const handleCompleteEvidence = async (evidenceData) => {
    if (!activeCompletingWO) return;
    try {
      await workOrderService.completeWorkOrder(activeCompletingWO._id, evidenceData);
      alert('Resolution evidence submitted! Sent for supervisor verification.');
      setActiveCompletingWO(null);
      fetchWorkerOrders();
    } catch (err) {
      alert('Failed to submit resolution evidence.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mobile-inspired Field Header Card */}
      <div className="bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-2xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-sans uppercase">
                FIELD OPERATIONS CONTROL PANEL
              </h1>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold mt-0.5">
                FIELD WORKER: {currentUser?.name || 'FIELD CREW'} • ICHALKARANJI RAPID RESPONSE
              </p>
            </div>
          </div>

          <button
            onClick={fetchWorkerOrders}
            disabled={loading}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Today's Assignments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
            TODAY'S ASSIGNED WORK ORDERS ({workOrders.length})
          </h2>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold">ACTIVE GPS LOCATION TRACKING ON</span>
        </div>

        <div className="space-y-4">
          {workOrders.length === 0 && !loading && (
            <div className="p-8 text-center bg-white dark:bg-brand-charcoal rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
              No active work orders assigned to this crew today.
            </div>
          )}
          {workOrders.map((wo) => (
            <div
              key={wo._id}
              className="bg-white dark:bg-brand-charcoal p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">{wo.workOrderId}</span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                  wo.priority === 'P1'
                    ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/40'
                    : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/40'
                }`}>
                  {wo.priority} • 1.8 km away
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-sans">{wo.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-1">{wo.instructions || 'Inspect site and carry out road restoration.'}</p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Station Road, Prabhag 4, Ichalkaranji
                </span>
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                  <Clock className="w-3.5 h-3.5" /> SLA: 03h 21m Remaining
                </span>
              </div>

              {/* Workflow Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                {wo.status === 'ASSIGNED' && (
                  <button
                    onClick={() => handleAccept(wo._id)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md"
                  >
                    ACCEPT ASSIGNMENT
                  </button>
                )}

                {wo.status === 'ACCEPTED' && (
                  <button
                    onClick={() => handleStart(wo._id)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" /> START FIELD WORK
                  </button>
                )}

                {wo.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => setActiveCompletingWO(wo)}
                    className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> MARK COMPLETED & UPLOAD EVIDENCE
                  </button>
                )}

                {['COMPLETED', 'VERIFICATION_PENDING'].includes(wo.status) && (
                  <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40 text-xs font-bold font-mono rounded-xl flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pending Supervisor Approval
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Modal */}
      {activeCompletingWO && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <ResolutionEvidenceUploader
            onComplete={handleCompleteEvidence}
            onCancel={() => setActiveCompletingWO(null)}
          />
        </div>
      )}
    </div>
  );
}
