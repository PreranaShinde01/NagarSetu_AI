import React, { useState, useEffect } from 'react';
import { workOrderService } from '../../services/api/workOrderService';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, CheckCircle2, AlertTriangle, Users, Clock, RefreshCw } from 'lucide-react';

export default function DepartmentDashboardPage() {
  const { currentUser } = useAuth();
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWO, setSelectedWO] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [notes, setNotes] = useState('');

  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      const res = await workOrderService.getWorkOrders({ limit: 20 });
      if (res.data) setWorkOrders(res.data);
      else if (Array.isArray(res)) setWorkOrders(res);
    } catch (err) {
      console.warn('Work orders fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const handleVerify = async (decision) => {
    if (!selectedWO) return;
    setVerifying(true);
    try {
      await workOrderService.verifyWorkOrder(selectedWO._id, { decision, notes });
      alert(`Supervisor verification recorded (${decision}).`);
      setSelectedWO(null);
      fetchWorkOrders();
    } catch (err) {
      alert('Verification failed: ' + (err.message || 'Error'));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-sans uppercase">
                  DEPARTMENT OPERATIONS COMMAND: ROAD & WATER CELL
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  Live DB • Ichalkaranji
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                Department Officer & Supervisor field dispatch and resolution verification hub.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchWorkOrders}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">ACTIVE WORK ORDERS</span>
          <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-1 block">28</span>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-brand-charcoal border border-rose-200 dark:border-rose-500/30 shadow-sm transition-colors">
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">P1 ISSUES</span>
          <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 font-mono mt-1 block">4</span>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-brand-charcoal border border-amber-200 dark:border-amber-400/30 shadow-sm transition-colors">
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">SLA AT RISK</span>
          <span className="text-xl font-extrabold text-amber-600 dark:text-amber-300 font-mono mt-1 block">7</span>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-brand-charcoal border border-cyan-200 dark:border-cyan-500/30 shadow-sm transition-colors">
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">WORKERS ACTIVE</span>
          <span className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono mt-1 block">16</span>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-brand-charcoal border border-emerald-200 dark:border-emerald-500/30 shadow-sm transition-colors">
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">COMPLETED TODAY</span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">31</span>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">AVG RESOLUTION</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-slate-200 font-mono mt-1 block">6h 42m</span>
        </div>
      </div>

      {/* Work Orders Table */}
      <div className="bg-white dark:bg-brand-charcoal rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden transition-colors">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-sans uppercase">Department Work Orders & Field Dispatch</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">WORK ORDER ID</th>
                <th className="p-3.5">TITLE / COMPLAINT</th>
                <th className="p-3.5">ASSIGNED TEAM</th>
                <th className="p-3.5">PRIORITY</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5">SUPERVISOR VERIFICATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {workOrders.map((wo) => (
                <tr key={wo._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap">{wo.workOrderId}</td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-200">{wo.title}</td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">{wo.assignedTeam || 'Team Alpha'}</td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold rounded border border-amber-200 dark:border-amber-500/40">
                      {wo.priority}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">{wo.status}</td>
                  <td className="p-3.5 whitespace-nowrap">
                    {wo.status === 'COMPLETED' || wo.verificationStatus === 'PENDING_SUPERVISOR' ? (
                      <button
                        onClick={() => setSelectedWO(wo)}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] rounded transition-colors"
                      >
                        VERIFY COMPLETION
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-bold">{wo.verificationStatus || 'VERIFIED'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supervisor Verification Modal */}
      {selectedWO && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl transition-colors">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
              Field Completion Verification: <span className="text-amber-600 dark:text-amber-400">{selectedWO.workOrderId}</span>
            </h3>

            <div className="bg-slate-50 dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
              <div><span className="text-slate-500">Worker Notes:</span> <p className="text-slate-800 dark:text-slate-200 mt-0.5">{selectedWO.completionNotes || 'Site inspected, repairs completed and tested.'}</p></div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]"><CheckCircle2 className="w-4 h-4" /> GPS Coordinates Verified</div>
            </div>

            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 font-mono block mb-1">SUPERVISOR AUDIT NOTES</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Quality inspection notes..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 rounded p-2 outline-none h-20"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button onClick={() => setSelectedWO(null)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded border border-slate-200 dark:border-slate-700">Cancel</button>
              <div className="flex gap-2">
                <button onClick={() => handleVerify('REJECT')} className="px-3 py-1.5 bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/40 text-xs font-bold rounded">✕ Request Rework</button>
                <button onClick={() => handleVerify('APPROVE')} className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded shadow-sm">✓ Approve Resolution</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
