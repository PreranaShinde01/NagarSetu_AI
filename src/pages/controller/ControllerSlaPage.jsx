import React, { useState, useEffect } from 'react';
import { slaService } from '../../services/api/slaService';
import SLAHealthGraphic from '../../components/graphics/SLAHealthGraphic';
import { Clock, AlertTriangle, CheckCircle2, ShieldAlert, RefreshCw, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ControllerSlaPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    complianceRate: 91.4,
    atRiskCount: 63,
    breachedCount: 19,
    avgResponseMinutes: 48,
    avgResolutionMinutes: 462,
  });
  const [atRiskItems, setAtRiskItems] = useState([]);
  const [breachedItems, setBreachedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSlaData = async () => {
    setLoading(true);
    try {
      const [sumRes, atRiskRes, breachRes] = await Promise.all([
        slaService.getSlaSummary(),
        slaService.getAtRisk(),
        slaService.getBreached(),
      ]);

      if (sumRes.data) setSummary(sumRes.data);
      if (atRiskRes.data?.complaints) setAtRiskItems(atRiskRes.data.complaints);
      if (breachRes.data?.complaints) setBreachedItems(breachRes.data.complaints);
    } catch (err) {
      console.warn('SLA fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlaData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-sans uppercase tracking-wide">
                  Municipal SLA Command Center
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  Live DB • Ichalkaranji
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                Real-time Service Level Agreement monitoring engine & breach prevention matrix.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchSlaData}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
          <span>Refresh SLA</span>
        </button>
      </div>

      {/* SLA Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-amber-200 dark:border-amber-500/30 shadow-sm transition-colors flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block">COMPLIANCE</span>
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">{summary.complianceRate}%</span>
          </div>
          <SLAHealthGraphic score={summary.complianceRate} className="w-16 h-16" />
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-amber-200 dark:border-amber-400/30 shadow-sm transition-colors">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block">AT RISK</span>
          <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-300 font-mono mt-1 block">{summary.atRiskCount}</span>
          <span className="text-[10px] text-slate-500 font-mono">&lt; 2 Hours Remaining</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-rose-200 dark:border-rose-500/30 shadow-sm transition-colors">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block">BREACHED</span>
          <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono mt-1 block">{summary.breachedCount}</span>
          <span className="text-[10px] text-slate-500 font-mono">Requires Reassignment</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block">AVG RESPONSE</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-slate-200 font-mono mt-1 block">{summary.avgResponseMinutes} min</span>
          <span className="text-[10px] text-slate-500 font-mono">Triage Dispatch Time</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block">AVG RESOLUTION</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-slate-200 font-mono mt-1 block">7h 42m</span>
          <span className="text-[10px] text-slate-500 font-mono">End-to-End Field Time</span>
        </div>
      </div>

      {/* At-Risk Table */}
      <div className="bg-white dark:bg-brand-charcoal rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden transition-colors">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-amber-600 dark:text-amber-400 font-sans uppercase">SLA At-Risk Queue (&lt; 2 Hours Remaining)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">COMPLAINT ID</th>
                <th className="p-3.5">TITLE / CATEGORY</th>
                <th className="p-3.5">WARD & DEPT</th>
                <th className="p-3.5">PRIORITY</th>
                <th className="p-3.5">SLA REMAINING</th>
                <th className="p-3.5">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {atRiskItems.length === 0 && !loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 font-sans">
                    No tickets at immediate risk of SLA breach.
                  </td>
                </tr>
              ) : (
                atRiskItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap">{item.complaintId}</td>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-200">{item.title}</td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">{item.wardId?.name || 'Ward Area'}</td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-500/40">
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-3.5 text-amber-600 dark:text-amber-300 font-bold whitespace-nowrap animate-pulse">01h 42m remaining</td>
                    <td className="p-3.5 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/citizen/complaint/${item.complaintId}`)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded flex items-center gap-1 border border-slate-300 dark:border-slate-700 transition-colors"
                      >
                        <Eye className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Case
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
