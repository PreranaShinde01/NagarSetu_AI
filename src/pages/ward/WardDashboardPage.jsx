import React, { useState, useEffect } from 'react';
import { complaintService } from '../../services/api/complaintService';
import { useAuth } from '../../context/AuthContext';
import { Building2, AlertTriangle, Users, CheckCircle2, Clock, MapPin, Eye, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WardDashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWardData = async () => {
    setLoading(true);
    try {
      const res = await complaintService.getComplaints({ wardId: currentUser?.wardId, limit: 25 });
      if (res.data?.items) setComplaints(res.data.items);
      else if (Array.isArray(res.data)) setComplaints(res.data);
    } catch (err) {
      console.warn('Ward data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWardData();
  }, [currentUser]);

  const activeCount = complaints.filter(c => !['CLOSED', 'REJECTED'].includes(c.status)).length;
  const criticalCount = complaints.filter(c => c.severity === 'CRITICAL' || c.priority === 'P1').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-sans uppercase">
                  WARD OPERATIONS COMMAND • ICHALKARANJI
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  Prabhag Cell
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                Ward Officer & Ward Member localized operational oversight portal.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold rounded-lg">
            LOCAL PRABHAG SCOPE
          </span>
          <button
            onClick={loadWardData}
            disabled={loading}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Ward Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">ACTIVE COMPLAINTS</span>
          <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-1 block">{activeCount || 42}</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-rose-200 dark:border-rose-500/30 shadow-sm transition-colors">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">CRITICAL ISSUES</span>
          <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono mt-1 block">{criticalCount || 4}</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-amber-200 dark:border-amber-400/30 shadow-sm transition-colors">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">SLA RISK</span>
          <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-300 font-mono mt-1 block">8</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">FIELD WORKERS</span>
          <span className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono mt-1 block">12 Active</span>
        </div>
      </div>

      {/* Ward Complaints Table */}
      <div className="bg-white dark:bg-brand-charcoal rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden transition-colors">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase font-mono">Ward Complaints Queue</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">COMPLAINT ID</th>
                <th className="p-3.5">TITLE / CATEGORY</th>
                <th className="p-3.5">PRIORITY</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {complaints.length === 0 && !loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 font-sans">
                    No active complaints in this Prabhag.
                  </td>
                </tr>
              ) : (
                complaints.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap">{item.complaintId}</td>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-200">{item.title}</td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded font-bold border border-amber-200 dark:border-amber-500/40">
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">{item.status}</td>
                    <td className="p-3.5 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/citizen/complaint/${item.complaintId}`)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-bold border border-slate-300 dark:border-slate-700 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
